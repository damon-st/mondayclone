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
    const { idGroup } = await req.json();
    if (!idGroup) {
      return new NextResponse("Params not found", { status: 404 });
    }
    const groupTasks = await db.groupTasks.findUnique({
      where: {
        id: idGroup,
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
    const userExist = groupTasks.board.boardUser.find(
      (v) => v.userId === userId
    );
    if (!userExist) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (userExist.permitions !== "readAndWrite") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await db.groupTasks.delete({
      where: {
        id: idGroup,
      },
    });
    await db.tasks.deleteMany({
      where: {
        groupTaskId: idGroup,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Remove task sucess",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_DELETE_GROUP_TASKS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
