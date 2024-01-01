import { db } from "@/lib/db/prisma_db";
import { getBoardByIdAndUsers } from "@/lib/services/baord.service";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { PermitionsBoard } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idTaks, boardId, title, paid } = await req.json();
    if (!idTaks || !boardId) {
      return new NextResponse("Params not found", { status: 404 });
    }
    const board = await getBoardByIdAndUsers(boardId);
    if (!board) {
      return new NextResponse("Board not exits", { status: 404 });
    }

    const exitsUser = board.boardUser.find((v) => v.userId == userId);
    if (!exitsUser) {
      return new NextResponse("User not found", { status: 404 });
    }
    if (exitsUser.permitions !== "readAndWrite") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const groupTaks = await db.groupTasks.findUnique({
      where: {
        id: idTaks,
      },
    });
    if (!groupTaks) {
      return new NextResponse("Group Taks not found", { status: 404 });
    }

    await db.groupTasks.update({
      where: {
        id: idTaks,
      },
      data: {
        title,
        paid,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Update data success",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_UPDATE_GROUP_TAKS]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
