import { ReactNode, Suspense } from "react";
import { LoadContentFirstBoard } from "./_components/load_content_firs";
import { Skeleton } from "@/components/ui/skeleton";

export default function BoardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadContentFirstBoard.skeleton />}>
      <LoadContentFirstBoard>{children}</LoadContentFirstBoard>
    </Suspense>
  );
}
