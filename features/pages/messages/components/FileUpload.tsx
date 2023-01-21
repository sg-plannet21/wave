import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import NotificationContext from 'state/notifications/NotificationContext';

const maxFileSize = 1000 * 1000;

type FileUploadProps = {
  onDrop: (acceptedFiles: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onDrop }) => {
  const handleDrop = useCallback(onDrop, [onDrop]);
  const { addNotification } = useContext(NotificationContext);

  function handleDropRejected(fileRejections: FileRejection[]) {
    fileRejections.forEach((fileRejection) => {
      console.log('fileRejection', fileRejection);
      addNotification({
        title: `${fileRejection.file.name} Rejected`,
        message: `${fileRejection.errors
          .map((error) => error.message)
          .join(', ')}`,
        duration: 10000,
        type: 'warning',
      });
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    maxSize: maxFileSize,
    accept: {
      'audio/*': [],
    },
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
  });

  return (
    <div
      className="flex items-center justify-center w-full"
      {...getRootProps()}
    >
      <label
        htmlFor="dropzone-file"
        className={classNames(
          'flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600',
          { 'dark:border-green-500 border-green-600': isDragActive },
          { 'dark:border-gray-600 border-gray-300': !isDragActive }
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className={classNames(
              'w-10 h-10 mb-3',
              {
                'text-green-600 dark:text-green-400': isDragActive,
              },
              { 'text-gray-500 dark:text-gray-400': !isDragActive }
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p
            className={classNames(
              'mb-2 text-sm',
              {
                'text-green-600 dark:text-green-400': isDragActive,
              },
              { 'text-gray-500 dark:text-gray-400': !isDragActive }
            )}
          >
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p
            className={classNames(
              'text-xs',
              {
                'text-green-600 dark:text-green-400': isDragActive,
              },
              { 'text-gray-500 dark:text-gray-400': !isDragActive }
            )}
          >
            WAV, MP3, ACC or MIDI (MAX. {maxFileSize / 1000} KB)
          </p>
        </div>
        <input
          {...getInputProps()}
          id="dropzone-file"
          type="file"
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload;
