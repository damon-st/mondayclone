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
    const { extension, url, taskId, name } = await req.json();
    if (!extension || !url || !taskId) {
      return new NextResponse("Params not found", { status: 404 });
    }
    const tasks = await db.tasks.findUnique({
      where: {
        id: taskId,
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
    if (!tasks) {
      return new NextResponse("Tasks not found", { status: 404 });
    }
    const existUser = tasks.groupTask.board.boardUser.find(
      (v) => v.userId === userId
    );
    if (!existUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (existUser.permitions !== "readAndWrite") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const fileCreate = await db.files.create({
      data: {
        extension,
        url,
        taskId,
        userId,
        name,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        data: fileCreate,
        message: "Create file succefully",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_SAVE_FILE_DB]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
