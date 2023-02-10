import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from 'components/form/InputField';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import { Dictionary } from 'lodash';
import { useSession } from 'next-auth/react';
import getConfig from 'next/config';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { EntityRoles } from 'state/auth/types';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { UploadMessageDTO, uploadMessage } from '../api/uploadMessage';
import { Prompt } from '../types';
import FileUpload from './FileUpload';

type UploadMessageProps = {
  onSuccess: () => void;
};

const {
  publicRuntimeConfig: { fallbackRegionId },
} = getConfig();

const schema = z.object({
  files: z
    .object({
      file: z.any(),
      name: z.string().min(1, 'A filename is required').max(20),
    })
    .array()
    .min(1, 'At least one prompt is required.'),
});

type PromptDetail = {
  file: File;
  name: string;
};

type FormValues = {
  files: PromptDetail[];
};

function removeExtension(value: string) {
  return value.replace(/\.[^/.]+$/, '');
}

const MessageUploadForm: React.FC<UploadMessageProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const { activeBusinessUnit } = useContext(BusinessUnitContext);
  const currentRegionId =
    data?.user.business_unit_roles.find(
      (bu) => bu.business_unit === activeBusinessUnit?.id
    )?.default_region ?? fallbackRegionId;
  const { mutate } = useCollectionRequest<Prompt>('prompts', {
    revalidateOnFocus: false,
  });
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      files: [],
    },
  });
  const { fields, replace, remove } = useFieldArray({
    control,
    name: 'files',
  });
  const { addNotification } = useContext(NotificationContext);

  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Prompts,
  ]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  useEffect(() => {
    if (!hasWritePermissions) {
      addNotification({
        title: 'Unauthorised',
        message: 'Insufficeient privileges to upload messages',
        type: 'error',
      });
      onSuccess();
    }
  }, [hasWritePermissions, onSuccess, addNotification]);

  function handleDrop(acceptedFiles: File[]) {
    const mappedFiles: PromptDetail[] = acceptedFiles.map((file) => ({
      file,
      name: removeExtension(file.name),
    }));
    replace(mappedFiles);
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    const businessUnit = activeBusinessUnit?.id as string;

    mutate(
      async (existingMessages) =>
        Promise.all(
          values.files.map((fileData) => {
            const payload: UploadMessageDTO = {
              file: fileData.file,
              name: fileData.name,
              region: currentRegionId,
              businessUnit,
            };

            return uploadMessage(payload).then(({ data }) => {
              addNotification({
                type: 'success',
                title: `${data.prompt_name} Successfully Uploaded`,
                duration: 3000,
              });
              return data;
            });
          })
        )
          .then((data) => {
            const reduced: Dictionary<Prompt> = data.reduce(
              (lookup, prompt) => {
                lookup[prompt['prompt_id']] = prompt;
                return lookup;
              },
              {} as Dictionary<Prompt>
            );

            onSuccess();
            return { ...existingMessages, ...reduced };
          })
          .catch((error) => {
            console.log('error', error);
            addNotification({
              type: 'error',
              title: 'Something went wrong',
              duration: 3000,
            });
            return existingMessages;
          })
          .finally(() => setIsLoading(false)),
      { revalidate: false }
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="my-4 space-y-3">
        <FileUpload onDrop={handleDrop} />

        {fields.map((field, index) => {
          return (
            <section key={field.id}>
              <div className="my-1 flex items-end space-x-2">
                <div className="flex-1">
                  <InputField
                    registration={register(`files.${index}.name`)}
                    label={`Message ${index + 1} Name`}
                    error={errors.files?.[index]?.name}
                    className="flex-1"
                  />
                </div>
                <button
                  onClick={() => remove(index)}
                  className="mb-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <Trash className="h-7 w-7" />
                </button>
              </div>
            </section>
          );
        })}
        <div className="text-red-500">{errors.files?.message}</div>
        {fields.length > 0 && (
          <div>
            <Button
              disabled={isLoading || !hasWritePermissions}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              {fields.length > 1 ? 'Upload Messages' : 'Upload Message'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageUploadForm;
