import { getBoardsBySpaceWorkId } from "@/lib/services/baord.service";
import { createRoute } from "@/routes/routes";
import { auth } from "@clerk/nextjs";
import { GanttChart } from "lucide-react";
import Link from "next/link";
import { BoardItems } from "./borad_items";

interface GetBoardsListProps {
  spaceWorkId: string;
}
export const GetBoardsList = async ({ spaceWorkId }: GetBoardsListProps) => {
  const { userId } = auth();
  const boards = await getBoardsBySpaceWorkId(spaceWorkId, userId ?? "");
  return (
    <div className="w-full p-1">
      {boards.map((v) => (
        <BoardItems key={v.id} board={v} />
      ))}
    </div>
  );
};

GetBoardsList.skeleton = function () {
  const list = [0, 1, 2, 3];
  return (
    <>
      <div role="status" className="max-w-sm animate-pulse">
        {list.map((v) => (
          <div
            key={v}
            className="h-8 bg-gray-200 rounded-sm dark:bg-gray-700 max-w-full mt-2"
          ></div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};
