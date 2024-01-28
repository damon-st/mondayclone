"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { GifsResult } from "@giphy/js-fetch-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "./ui/input";
import { useDebounce } from "usehooks-ts";
import axios from "axios";
import { ResponseModel } from "@/models/response_model";
interface GiphyPopoverProps {
  children: ReactNode;
  onSelectChange: (url: string) => void;
}

export const GiphyPopover = ({
  children,
  onSelectChange,
}: GiphyPopoverProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [giftResults, setGiftResults] = useState<GifsResult | null>(null);
  const debouncedValue = useDebounce<string>(searchValue, 500);
  const onGifSelected = (gif: any, e: SyntheticEvent<HTMLElement, Event>) => {
    e.preventDefault();
    onSelectChange(gif.images.preview_gif.url);
  };

  useEffect(() => {
    const search = async () => {
      try {
        const result = await axios.post<ResponseModel<GifsResult>>(
          "/api/giphy",
          {
            value: debouncedValue,
          }
        );
        setGiftResults(result.data.data ?? null);
      } catch (error) {
        console.log(error);
      }
    };
    search();
  }, [debouncedValue]);
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[400px] overflow-auto">
        <div className="w-full mb-2">
          <Input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder="Encuentra un GIF"
          />
        </div>
        <ScrollArea className="h-[400px] relative w-full rounded-md border overflow-y-auto ">
          <div className="w-full grid grid-cols-2">
            {giftResults?.data.length == 0 && (
              <div className="w-full h-full flex items-center justify-center p-4">
                <p className="text-lg">Sin resultados</p>
              </div>
            )}
            {giftResults?.data.map((v) => (
              <picture onClick={(e) => onGifSelected(v, e)} key={v.id}>
                <img
                  src={v.images.preview_gif.url}
                  alt="img"
                  className="w-full h-24 object-cover"
                />
              </picture>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
