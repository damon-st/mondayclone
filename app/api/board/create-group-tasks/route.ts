import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { PermitionsBoard } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { title, expanded, boardId, color } = await req.json();

    if (!title || !color || !boardId) {
      return new NextResponse("Params not found", { status: 400 });
    }

    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        boardUser: true,
      },
    });
    if (!board) {
      return new NextResponse("Not found board ", { status: 404 });
    }

    const existUser = board.boardUser.find((v) => v.userId === userId);

    if (!existUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (existUser.permitions === "read") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await db.groupTasks.create({
      data: {
        color,
        title,
        boardId,
        expanded,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Creating group task succefully",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_CREATE_GROUP_TASKS]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
