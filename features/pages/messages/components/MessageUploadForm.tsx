import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import FileUpload from './FileUpload';

const schema = z.object({
  files: z
    .object({
      file: z.any(),
      name: z.string().min(1, 'A filename is required').max(20),
    })
    .array()
    .min(1, 'At least one prompt is required.'),
});

type Prompt = {
  file: File;
  name: string;
};

type FormValues = {
  files: Prompt[];
};

function removeExtension(value: string) {
  return value.replace(/\.[^/.]+$/, '');
}

const MessageUploadForm: React.FC = () => {
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

  function handleDrop(acceptedFiles: File[]) {
    // Do something with the files
    console.log(acceptedFiles);
    const mappedFiles: Prompt[] = acceptedFiles.map((file) => ({
      file,
      name: removeExtension(file.name),
    }));
    // setFiles(mappedFiles);
    replace(mappedFiles);
  }

  function onSubmit(values: FormValues) {
    console.log('submit');
    console.log(values);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <h4 className="text-3xl text-emerald-500 font-bold">File Upload</h4>

      <form onSubmit={handleSubmit(onSubmit)} className="my-4 space-y-3">
        <FileUpload onDrop={handleDrop} />
        {fields.map((field, index) => {
          return (
            <section key={field.id}>
              <div className="my-1 flex items-end space-x-2">
                <label className="w-full">
                  <span>Message {index + 1} Name</span>
                  <input
                    type="text"
                    className="px-3 py-1 bg-zinc-800 text-gray-50 w-full flex-1"
                    {...register(`files.${index}.name`)}
                  />
                </label>
                <button
                  type="button"
                  className="px-2 py-1 bg-red-800 text-gray-50"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  Remove
                </button>
              </div>
              <div className="text-red-500">
                {errors.files?.[index]?.name?.message}
              </div>
            </section>
          );
        })}
        <div className="text-red-500">{errors.files?.message}</div>
        <button
          type="submit"
          className="w-full p-2 bg-indigo-500 text-purple-800 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MessageUploadForm;
