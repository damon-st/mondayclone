import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { ConversationsTasks } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { idTask, description } = await req.json();
    if (!description) {
      return new NextResponse("Params not found", { status: 404 });
    }
    if (!idTask) {
      return new NextResponse("Params not found", { status: 404 });
    }

    const task = await db.tasks.findUnique({
      where: {
        id: idTask,
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

    let conversation: any = await db.conversationsTasks.create({
      data: {
        description,
        userId,
        taskId: idTask,
      },
    });

    const user = await db.users.findUnique({
      where: {
        userId: userId,
      },
    });
    conversation.user = user;
    return NextResponse.json(
      <ResponseModel<ConversationsTasks>>{
        data: conversation,
        message: "success create conversation",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_TASKS_CONVERSATION]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
