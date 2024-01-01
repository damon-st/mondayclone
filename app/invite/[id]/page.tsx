import { Skeleton } from "@/components/ui/skeleton";
import { addUserInBoard } from "@/lib/services/baord.service";
import { getSharedBoardLink } from "@/lib/services/sharedboard.service";
import { createRoute } from "@/routes/routes";
import { auth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const shared = await getSharedBoardLink(params.id);
  if (!shared) {
    return redirect("/");
  }
  const result = await addUserInBoard(
    userId,
    shared.boardId,
    shared.permitions
  );
  const success = result.status === "success";
  const url = createRoute("board", {
    idBoard: shared.boardId,
  });
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h2 className="text-xl mb-2">{result.message}</h2>
      {success && (
        <Link href={url} className="rounded-sm p-3 bg-azul text-white text-xl">
          Ir al tablero
        </Link>
      )}
      {!success && (
        <Link href={"/"} className="rounded-sm p-3 bg-azul text-white text-xl ">
          Regresar
        </Link>
      )}
    </div>
  );
}
