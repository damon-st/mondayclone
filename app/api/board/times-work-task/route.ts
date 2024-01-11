import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { TasksTimesWorks } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idTask, timeInit } = await req.json();
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

    const timeWork = await db.tasksTimesWorks.create({
      data: {
        timeInit,
        taskId: idTask,
      },
    });

    return NextResponse.json(
      <ResponseModel<TasksTimesWorks>>{
        data: timeWork,
        message: "Success create new time",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_TIMES_WORK_TASKS_CREATE]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idTask, timeEnd, idTimeWork } = await req.json();
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

    const timeExist = await db.tasksTimesWorks.findUnique({
      where: { id: idTimeWork },
    });
    if (!timeExist) {
      return new NextResponse("Time work task not found", { status: 404 });
    }
    const timeEdit = await db.tasksTimesWorks.update({
      where: {
        id: idTimeWork,
      },
      data: {
        timeEnd,
      },
    });

    return NextResponse.json(
      <ResponseModel<TasksTimesWorks>>{
        data: timeEdit,
        message: "Update data success",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_TIMES_WORK_TASKS_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idTask, idTimeWork } = await req.json();
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

    const timeExist = await db.tasksTimesWorks.findUnique({
      where: { id: idTimeWork },
    });
    if (!timeExist) {
      return new NextResponse("Time work task not found", { status: 404 });
    }
    const timeDelete = await db.tasksTimesWorks.delete({
      where: {
        id: idTimeWork,
      },
    });
    return NextResponse.json(
      <ResponseModel<TasksTimesWorks>>{
        message: "Delete success",
        status: "success",
        statusCode: 200,
        data: timeDelete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_TIMES_WORK_TASKS_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
