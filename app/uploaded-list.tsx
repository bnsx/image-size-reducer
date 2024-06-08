"use client";

import { filesAtom, handleStatusUpdate } from "@/states/file";
import { useAtom } from "jotai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import DownloadButton from "@/components/DownloadButton";
import { formatFileSize } from "@/lib/size";
import { downloadAll } from "@/lib/download";

export default function UploadedList() {
  const [files, setFiles] = useAtom(filesAtom);

  const removeObject = (blobURL: string) => {
    setFiles(files.filter((x) => x.blobURL !== blobURL));
  };

  return (
    <>
      <ScrollArea
        className={cn(
          files.length > 0 ? "block" : "hidden",
          "rounded-[--radius] p-3 bg-white h-64"
        )}
      >
        {files.map((obj, index) => (
          <div key={obj.blobURL}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Link
                  href={obj.blobURL}
                  target="_blank"
                  key={obj.file.name + index}
                  className="block text-sm w-52 xl:w-64 truncate"
                  title={obj.file.name}
                >
                  {obj.file.name}
                </Link>
                <div className="space-y-1">
                  <div className="space-x-1">
                    <Badge className="text-xs w-fit" variant={"outline"}>
                      {handleStatusUpdate(obj.status)}
                    </Badge>
                    {obj.status === "done" && (
                      <Badge className="text-xs" variant={"outline"}>
                        ประหยัด {obj.savedPercent}%
                      </Badge>
                    )}
                  </div>
                  {obj.status !== "done" && (
                    <Badge className="text-xs" variant={"outline"}>
                      {obj.progress}%
                    </Badge>
                  )}
                  {obj.status === "done" && (
                    <Badge className="block text-xs w-fit" variant={"outline"}>
                      {formatFileSize(obj.file.size)} {"->"}{" "}
                      {formatFileSize(Number(obj.newFile?.size))}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-x-1">
                {obj.status === "done" && obj.newBlobURL && obj.newFile && (
                  <DownloadButton
                    blobUrl={obj.newBlobURL}
                    fileName={obj.newFile.name}
                  />
                )}
                <Button
                  type="button"
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => removeObject(obj.blobURL)}
                >
                  <Cross2Icon />
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </ScrollArea>
      {files.some((x) => x.status === "done") && (
        <Button
          type="button"
          variant={"outline"}
          onClick={() => downloadAll(files)}
        >
          ดาวน์โหลดทั้งหมด
        </Button>
      )}
    </>
  );
}
