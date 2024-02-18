import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function Loading({}: Props) {
  return (
    <div className="size-full bg-gray-100 flex flex-col p-2 space-y-4">
      <Skeleton className="w-full h-24 rounded-lg bg-black" />
      <div className="size-full flex items-center justify-center space-x-2">
        <Skeleton className="w-[30%] h-full rounded-lg bg-black" />
        <Skeleton className="w-[70%] h-full rounded-lg bg-black" />
      </div>
    </div>
  );
}
