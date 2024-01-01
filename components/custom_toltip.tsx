import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export const CustomToolpip = ({
  children,
  msg,
  side,
}: {
  children: ReactNode;
  msg: string;
  side?: "top" | "right" | "bottom" | "left";
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{msg}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
