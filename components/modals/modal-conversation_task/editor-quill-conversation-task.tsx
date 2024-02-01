"use client";
import { Button } from "@/components/ui/button";
import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { SmileIcon } from "lucide-react";
import { EmojiPickerPopover } from "@/components/emoji-popover";
import { GiphyPopover } from "@/components/giphy-popover";
import { ResponseModel } from "@/models/response_model";
import axios from "axios";
import toast from "react-hot-toast";

interface EditorQuillConversationTaksProps {
  onSaveCon: (data: any) => void;
  idTask: string;
}

export const EditorQuillConversationTaks = ({
  onSaveCon,
  idTask,
}: EditorQuillConversationTaksProps) => {
  const [isPending, startTransition] = useTransition();

  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
      }),
    []
  );
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "code",
    "image",
  ];
  const toolbar = [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "code"],
    ["clean"],
  ];

  const onSelectEmoji = (emoji: string) => {
    console.log(value.substring(value.length - 4, value.length));
    setValue((prev) => prev + "<p>" + emoji + "</p>");
  };

  const onSelectGif = (gif: string) => {
    console.log(gif);

    setValue((prev) => prev + `<img src="${gif} width="50" height="50" />`);
  };

  const onSave = (value: string) => {
    if (value.length < 2) {
      toast.error("Please message is required");
      return;
    }
    if (isPending) return;
    startTransition(async () => {
      try {
        const result = await axios.post<ResponseModel<any>>(
          "/api/board/tasks/conversations",
          {
            idTask: idTask,
            description: value,
          }
        );
        if (!result.data.data) {
          throw new Error("Error un save");
        }
        onSaveCon(result.data.data);
        setValue("");
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="w-full">
      <ReactQuill
        id="quillRef"
        theme="snow"
        value={value}
        onChange={setValue}
        formats={formats}
        modules={{ toolbar }}
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <EmojiPickerPopover onSelectEmoji={onSelectEmoji}>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-grisHover rounded-sm p-1 transition-colors duration-200">
              <p className="flex items-center ">
                <SmileIcon className="size-4" />
              </p>
              <span>Emoji</span>
            </div>
          </EmojiPickerPopover>
          <GiphyPopover onSelectChange={onSelectGif}>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-grisHover rounded-sm p-1 transition-colors duration-200">
              <span>GIF</span>
            </div>
          </GiphyPopover>
        </div>
        <div className="flex items-center justify-end">
          <Button
            disabled={isPending}
            type="button"
            onClick={() => onSave(value)}
          >
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
};
