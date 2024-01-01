"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useState } from "react";
import { es } from "date-fns/locale";

interface DatePickerWithRangeProps {
  className?: string;
  from?: Date;
  to?: Date;
  children: ReactNode;
  onChangeRange: (range: DateRange) => void;
}

export function DatePickerWithRange({
  className,
  from,
  to,
  children,
  onChangeRange,
}: DatePickerWithRangeProps) {
  const now = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: from ?? now,
    to: to ?? addDays(now, 2),
  });

  const onSelectDate = (data: DateRange | undefined) => {
    setDate(data);
    if (data?.from && data.to) {
      onChangeRange(data);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={es}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelectDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
