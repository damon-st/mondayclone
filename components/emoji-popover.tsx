"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerPopoverProps {
  children: ReactNode;
  onSelectEmoji: (value: string) => void;
}

export const EmojiPickerPopover = ({
  children,
  onSelectEmoji,
}: EmojiPickerPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Picker
          data={data}
          onEmojiSelect={(d: any) => {
            onSelectEmoji(d.native);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
