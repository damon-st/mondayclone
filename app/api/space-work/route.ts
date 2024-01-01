import { updateDataSpaceWork } from "@/lib/services/work_pasce.service";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { userId: idUser } = auth();
    if (!idUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { nameWork, descriptionWork, id, userId } = await req.json();
    if (!nameWork || !id || !userId) {
      return new NextResponse("Params not found", { status: 400 });
    }

    const updatedData = await updateDataSpaceWork({
      descriptionWork,
      id,
      nameWork,
      userId,
    });

    return NextResponse.json(
      JSON.stringify(<ResponseModel<any>>{
        message: "Updated data successfuly",
        status: "success",
        statusCode: 200,
        data: updatedData,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("[ERROR_API_SPACE_WORK_PUT]", error);

    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
