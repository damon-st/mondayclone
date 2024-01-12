import { currentUser } from "@clerk/nextjs";
import { Flashlight, MessageSquare } from "lucide-react";
import Image from "next/image";
import { GetWorksSpaces } from "./_components/get_works_spaces";

export default async function BoardPage() {
  const date = new Date();
  const msg = date.getHours() >= 18 ? "!Buenas noches, " : "!Buenos dias, ";
  const user = await currentUser();
  return (
    <div className="bg-[#f6f7fb] rounded-l-lg w-full h-full relative">
      <div className="w-full h-[10%] bg-white rounded-l-lg flex items-center">
        <div className="w-[70%] h-full flex items-center justify-center">
          <div className="w-full md:w-[60%] p-2">
            <h2 className="text-xs md:text-lg">
              {msg}
              {user?.firstName}!
            </h2>
            <p className="text-xs">
              Accede rápidamente a tus tableros recientes, el buzón y los
              espacios de trabajo
            </p>
          </div>
          <div className="hidden md:block w-[40%] h-full relative">
            <Image
              width={300}
              height={600}
              className="w-full h-full object-cover"
              alt="navidad"
              src="/navidad.svg"
            />
          </div>
        </div>
        <div className="hidden md:flex w-[30%] h-full  items-center justify-center gap-x-2">
          <div className="flex gap-x-1">
            <MessageSquare className="w-4 h-4" />
            <p className="text-sm">Dejar comentarios</p>
          </div>
          <button className="bg-azul rounded-sm p-2 text-white flex items-center gap-x-1">
            <Flashlight className="w-4 h-4" />
            <p>Búsqueda rápida</p>
          </button>
        </div>
      </div>
      <div className="w-full h-[89%] p-4 flex">
        <div className="w-full md:w-[70%] bg-white h-[90%] rounded-lg">
          <GetWorksSpaces userId={user?.id ?? ""} />
        </div>
      </div>
    </div>
  );
}
