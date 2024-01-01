import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { TypeActivityBoard } from "@/models/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idGroupTasks, title } = await req.json();
    const groupTasks = await db.groupTasks.findUnique({
      where: {
        id: idGroupTasks,
      },
      include: {
        board: {
          include: {
            boardUser: true,
          },
        },
      },
    });
    if (!groupTasks) {
      return new NextResponse("Group tasks not found", { status: 404 });
    }
    const userBoard = groupTasks.board.boardUser.find(
      (v) => v.userId === userId
    );
    if (!userBoard) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (userBoard.permitions !== "readAndWrite") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const taskCreated = await db.tasks.create({
      data: {
        title: title,
        groupTaskId: idGroupTasks,
        userId,
      },
    });

    await db.activityBoard.create({
      data: {
        userId,
        taskId: taskCreated.id,
        typeActivity: TypeActivityBoard.create,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Created task succefully",
        status: "success",
        statusCode: 200,
        data: taskCreated,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
