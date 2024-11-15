"use client";

import { removeUnnecessaryImages } from "@/services/carServices";
import { formatFileSize } from "@edgestore/react/utils";
import { UploadCloudIcon } from "lucide-react";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { clsx } from "clsx";

const variants = {
  base: "relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  image: "border-0 p-0 w-full h-full relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md",
  active: "border-2",
  disabled: "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

export type FileState = {
  file: File;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge: (maxSize: number) => `The file is too large. Max size is ${formatFileSize(maxSize)}.`,
  fileInvalidType: "Invalid file type.",
  tooManyFiles: (maxFiles: number) => `You can only add ${maxFiles} file(s).`,
  fileNotSupported: "The file is not supported.",
};

const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps & { setFunction: (a: string[]) => void }>(
  ({ dropzoneOptions, value, className, disabled, onChange, onFilesAdded, setFunction }, ref) => {
    const [customError, setCustomError] = React.useState<string>();

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { "image/*": [] },
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);

        if (dropzoneOptions?.maxFiles && (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }

        if (files.length > 0) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));

          onFilesAdded?.(addedFiles);
          onChange?.([...(value ?? []), ...addedFiles]);

          if (setFunction) {
            const fileUrls = addedFiles.map((addedFile) =>
              typeof addedFile.file === "string" ? addedFile.file : URL.createObjectURL(addedFile.file)
            );
            setFunction(removeUnnecessaryImages(fileUrls));
          }
        }
      },
      ...dropzoneOptions,
    });

    const dropZoneClassName = React.useMemo(
      () =>
        clsx(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ),
      [isFocused, fileRejections, isDragAccept, isDragReject, disabled, className]
    );

    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        const errorCode = errors[0]?.code;

        switch (errorCode) {
          case "file-too-large":
            return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
          case "file-invalid-type":
            return ERROR_MESSAGES.fileInvalidType;
          case "too-many-files":
            return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
          default:
            return ERROR_MESSAGES.fileNotSupported;
        }
      }
      return customError;
    }, [fileRejections, dropzoneOptions, customError]);

    return (
      <div className="w-full h-full">
        <div>
          {(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
            <div {...getRootProps({ className: dropZoneClassName })}>
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                <UploadCloudIcon className="mb-2 h-7 w-7" />
                <div className="text-gray-400 px-3">drag & drop to upload up to 10 images</div>
                <div className="mt-3">
                  <Button type="button" disabled={disabled}>
                    select
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Error Text */}
        {errorMessage && <div className="mt-1 text-xs text-red-500">{errorMessage}</div>}
      </div>
    );
  }
);

MultiImageDropzone.displayName = "MultiImageDropzone";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      className={clsx(
        "focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
        "border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700",
        "h-6 rounded-md px-2 text-xs",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { MultiImageDropzone };
