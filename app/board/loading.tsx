import { Skeleton } from "@/components/ui/skeleton";
export default function LoadingPage() {
  return (
    <div className="w-full h-full bg-gris">
      <div className="w-full h-[10%] flex items-center justify-between">
        <div className="flex items-center justify-center">
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
      <div className="w-full h-[90%] flex items-center">
        <div className="w-[15%] h-full p-2 bg-white rounded-r-sm">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="w-[1%] h-full"></div>
        <div className="w-[84%] bg-white h-full rounded-l-sm p-2">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
