import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SpaceWork } from "@prisma/client";
import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface MenuHeaderProps {
  children: ReactNode;
  spacesWorks: SpaceWork;
}

export const MenuHeader = ({ children, spacesWorks }: MenuHeaderProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[90vw]" side="left">
        <Sidebar spacesWorks={spacesWorks} />
      </SheetContent>
    </Sheet>
  );
};
