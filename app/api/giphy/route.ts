import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }
    const { value } = await req.json();
    let searchTxt = "working";
    if (value && value.length > 0) {
      searchTxt = value;
    }
    const gif = new GiphyFetch(process.env.GIPHY_KEY!);
    const result = await gif.search(searchTxt, {
      offset: 10,
      limit: 10,
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        data: result,
        message: "success",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_giphy]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
