"use client";

import { FileState, FileStatus } from "@/@types/file";
import { UploadIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

const minSize = 10 * 1024; // 10KB
const mimetypes = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
};

interface Props {
  setFiles: Dispatch<SetStateAction<FileState[]>>;
}
export function MyDropzone({ setFiles }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          status: "wait" as FileStatus,
          file,
          blobURL: URL.createObjectURL(file),
          savedPercent: 0,
          progress: 0,
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onDropRejected = useCallback(
    (fileRejection: FileRejection[], event: DropEvent) => {},
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    minSize,
    multiple: true,
    accept: mimetypes,
  });
  return (
    <div
      {...getRootProps()}
      className="w-full border rounded-[--radius] border-dashed p-5 cursor-pointer"
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex justify-center gap-1">
        {isDragActive ? (
          <p className="text-sm">วางไฟล์ที่นี่ ...</p>
        ) : (
          <>
            <UploadIcon />
            <p className="text-sm">คลิ๊กหรือลากไฟล์มายังที่นี่</p>
          </>
        )}
      </div>
    </div>
  );
}
