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
    const { task } = await req.json();
    const { id, createdAt, title, files, ...restData } = task;
    const taskCreate = await db.tasks.create({
      data: {
        ...restData,
        title: `${title} (copy)`,
      },
    });
    await db.activityBoard.create({
      data: {
        userId,
        taskId: taskCreate.id,
        typeActivity: TypeActivityBoard.create,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Duplicate tasks succefully",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_DUPLICATE_TASK]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
