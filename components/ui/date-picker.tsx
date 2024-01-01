"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { ReactNode, useState } from "react";

interface DatePickerProps {
  children: ReactNode;
  date: Date;
  onChangeDate: (date: Date | undefined) => void;
}

export function DatePicker({ children, date, onChangeDate }: DatePickerProps) {
  const [openPanel, setOpenPanel] = useState(false);

  return (
    <Popover open={openPanel} onOpenChange={(c) => setOpenPanel(c)}>
      <PopoverTrigger onClick={() => setOpenPanel(true)} asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(c) => {
            onChangeDate(c);
            setOpenPanel(false);
          }}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
