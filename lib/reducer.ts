import { FileAtomDataType } from "@/states/file";
import bic, { Options } from "browser-image-compression";

interface ReducerProps {
  imageFile: FileAtomDataType;
  maxSizeMB: number;
  signal?: AbortSignal;
  fileType?: string;
  compressingPercent: (blobURL: string, percent: number) => void;
}
export type ReducerReturnProps = {
  blobURL: string;
  status: FileAtomDataType["status"];
  savedPercent: FileAtomDataType["savedPercent"];
  file: File;
  newFile?: FileAtomDataType["newFile"];
};

export async function Reducer({
  imageFile: file,
  maxSizeMB,
  signal,
  fileType = "image/jpeg",
  compressingPercent,
}: ReducerProps): Promise<ReducerReturnProps> {
  const options: Options = {
    initialQuality: 0.85,
    alwaysKeepResolution: false,
    maxSizeMB,
    useWebWorker: true,
    preserveExif: false,
    fileType,
    signal,
    onProgress(progress) {
      compressingPercent(file.blobURL, progress);
    },
  };
  try {
    const compressedFileData = await bic(file.file, options);
    const timestamp = Date.now();
    const newFilename = `reduced_${timestamp}`;
    // Create a new File object with the compressed data and filename
    const completelyFile = new File([compressedFileData], newFilename, {
      type: fileType,
      lastModified: timestamp,
    });

    const originalSize = file.file.size;
    const compressedSize = compressedFileData.size;

    const savedPercent = parseFloat(
      (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
    );

    return {
      blobURL: file.blobURL,
      status: "done",
      savedPercent,
      newFile: completelyFile,
      file: file.file,
    };
  } catch (error) {
    return {
      blobURL: file.blobURL,
      status: "incomplete",
      savedPercent: 0,
      file: file.file,
    };
  }
}

export async function ReducerMany(
  imageFiles: FileAtomDataType[],
  maxSizeMB: number,
  compressingPercent: (blobURL: string, percent: number) => void
) {
  return await Promise.all(
    imageFiles.map((imageFile) =>
      Reducer({ imageFile, maxSizeMB, compressingPercent })
    )
  );
}