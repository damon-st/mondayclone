"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { SmileIcon } from "lucide-react";
import { EmojiPickerPopover } from "@/components/emoji-popover";

export const EditorQuillConversationTaks = () => {
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
        </div>
        <div className="flex items-center justify-end">
          <Button>Actualizar</Button>
        </div>
      </div>
    </div>
  );
};
