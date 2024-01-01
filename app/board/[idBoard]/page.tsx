import { getBoardByIdAndUsers } from "@/lib/services/baord.service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { HeadBoard } from "./_components/head_board";
import { ContentBoard } from "./_components/content_board";

export default async function BoardId({
  params,
}: {
  params: {
    idBoard: string;
  };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const board = await getBoardByIdAndUsers(params.idBoard);
  if (!board) {
    return redirect("/");
  }
  const existUser = board.boardUser.find((v) => v.userId == userId);
  if (!existUser) {
    return redirect("/");
  }

  board.boardUser;

  return (
    <div className="w-full h-full bg-white rounded-l-lg  p-2">
      <div className="w-full h-[15%] ">
        <HeadBoard
          usersLength={board.boardUser.length}
          description={board.description}
          boardId={board.id}
          favorite={board.favorite}
          title={board.title}
        />
      </div>
      <div className="w-full h-[85%]">
        <ContentBoard
          boardUsers={board.boardUser}
          boardId={board.id}
          userId={userId}
        />
      </div>
    </div>
  );
}
