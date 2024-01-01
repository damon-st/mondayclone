import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { ActivityBoard } from "@prisma/client";
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
    let activity: any = await db.activityBoard.findFirst({
      where: {
        taskId: idTask,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (activity) {
      const user = await db.users.findUnique({
        where: {
          userId: activity.userId,
        },
      });
      activity.user = user;
    }

    const statusCode = activity ? 200 : 404;
    const status = activity ? "success" : "error";
    const message = activity ? "Activity found" : "Not found activitys";

    return NextResponse.json(
      <ResponseModel<any>>{
        message,
        status,
        statusCode,
        data: activity,
      },
      { status: statusCode }
    );
  } catch (error) {
    console.log("[ERROR_GET_ACTIVITY_TASKS]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
