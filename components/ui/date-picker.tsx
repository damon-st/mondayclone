"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { ReactNode, useState } from "react";
import TimeKeeper from "react-timekeeper";
import { Button } from "./button";

interface DatePickerProps {
  children: ReactNode;
  date: Date;
  onChangeDate: (date: Date | undefined) => void;
  onClosePanel?: boolean;
  showTimePicker?: boolean;
}

export function DatePicker({
  children,
  date,
  onChangeDate,
  onClosePanel = true,
  showTimePicker = false,
}: DatePickerProps) {
  const [dateInit, setDateInit] = useState(date);
  const [openPanel, setOpenPanel] = useState(false);

  return (
    <Popover open={openPanel} onOpenChange={(c) => setOpenPanel(c)}>
      <PopoverTrigger onClick={() => setOpenPanel(true)} asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="w-full flex">
          <Calendar
            mode="single"
            selected={dateInit}
            onSelect={(c) => {
              onChangeDate(c);
              if (c) {
                setDateInit(c!);
              }
              if (onClosePanel) {
                setOpenPanel(false);
              }
            }}
            initialFocus
            locale={es}
          />
          {showTimePicker && (
            <div className="w-full">
              <TimeKeeper
                onChange={(v) => {
                  const timeInit = new Date(
                    dateInit.getFullYear(),
                    dateInit.getMonth(),
                    dateInit.getDate(),
                    v.hour,
                    v.minute
                  );
                  setDateInit(timeInit);
                }}
                hour24Mode
                time={{
                  hour: dateInit.getHours(),
                  minute: dateInit.getMinutes(),
                }}
              />
            </div>
          )}
        </div>
        {showTimePicker && (
          <div className="w-full mt-2 mb-2 p-1 flex items-center justify-between">
            <Button
              onClick={() => {
                setOpenPanel(false);
              }}
              size="sm"
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                onChangeDate(dateInit);
                setOpenPanel(false);
              }}
              size="sm"
            >
              Confirmar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
