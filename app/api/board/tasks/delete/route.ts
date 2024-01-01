import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idTaks } = await req.json();
    const task = await db.tasks.findUnique({
      where: {
        id: idTaks,
      },
      include: {
        groupTask: {
          include: {
            board: {
              include: {
                boardUser: true,
              },
            },
          },
        },
      },
    });
    if (!task) {
      return new NextResponse("Not exist task", { status: 404 });
    }
    const userBoard = task.groupTask.board.boardUser.find(
      (v) => v.userId === userId
    );
    if (!userBoard) {
      return new NextResponse("User not found", { status: 404 });
    }
    if (userBoard.permitions !== "readAndWrite") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await db.tasks.delete({
      where: { id: idTaks },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Delete task succefully",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_DELETE_TASK]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
