import { getSpacesWorksUser } from "@/lib/services/work_pasce.service";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const response = await getSpacesWorksUser(params.userId);

    return NextResponse.json(
      <ResponseModel<any>>{
        message: "success",
        status: "success",
        statusCode: 200,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_SPACE_WORK_USER]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
