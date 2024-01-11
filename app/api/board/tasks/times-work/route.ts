import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idTask } = await req.json();
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
    const times = await db.tasksTimesWorks.findMany({
      where: {
        taskId: idTask,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "get data",
        status: "success",
        statusCode: 200,
        data: times,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_POST_TASKS_TIMES_WORK]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
