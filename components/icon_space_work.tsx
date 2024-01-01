import { cn } from "@/lib/utils";
import { Edit, Home } from "lucide-react";

interface IconSpaceWorkProps {
  nameWork: string;
  color?: string;
  size: "lg" | "sm";
  hover?: boolean;
}
export const IconSpaceWork = ({
  nameWork,
  color,
  size,
  hover,
}: IconSpaceWorkProps) => {
  return (
    <div
      className={cn(
        "  border-4 shadow-lg border-white p-3 flex items-center justify-center text-white relative bg-green-500",
        color,
        size == "lg" ? "w-28 h-28 text-6xl rounded-2xl" : "w-6 h-6 rounded-lg",
        hover && "group"
      )}
    >
      {nameWork.substring(0, 1).toUpperCase()}
      <Home
        className={cn(
          "w-4 h-4 absolute -bottom-2 -right-2 text-white fill-black ",
          size == "lg" && "h-12 w-12 -bottom-4 -right-4 z-10"
        )}
      />
      <div className="w-full h-full flex flex-col items-center transition-all duration-200 justify-center opacity-0 tranms bg-white/80 cursor-pointer absolute group-hover:opacity-100">
        <Edit className="w-8 h-8 text-blue-500" />
        <p className="text-blue-500 text-lg">Editar</p>
      </div>
    </div>
  );
};
