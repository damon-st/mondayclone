import { CustomToolpip } from "@/components/custom_toltip";
import { IconModay } from "@/components/icon_monday";
import { IconSpaceWork } from "@/components/icon_space_work";
import { getSpacesWorksUser } from "@/lib/services/work_pasce.service";
import { createRoute } from "@/routes/routes";
import { ChevronDown, Info } from "lucide-react";
import Link from "next/link";

interface GetWorksSpacesProps {
  userId: string;
}
export const GetWorksSpaces = async ({ userId }: GetWorksSpacesProps) => {
  const spacesWorks = await getSpacesWorksUser(userId);
  return (
    <div className="w-full h-full overflow-y-auto p-3">
      <div className="w-full flex items-center space-x-2">
        <ChevronDown className="w-4 h-4" />
        <p> Mis espacios de trabajo</p>
        <CustomToolpip msg="Estos son los espacios de trabajo de la cuenta que eres miembro">
          <Info className="w-4 h-4" />
        </CustomToolpip>
      </div>
      <div className="w-full grid grid-cols-2 gap-2 mt-2">
        {spacesWorks.map((v) => (
          <Link
            key={v.id}
            href={createRoute("spaceWorkDetails", {
              idSpace: v.id,
            })}
            className="rounded-sm p-3 border flex items-center justify-start space-x-2 hover:shadow-lg hover:scale-105 transition duration-200"
          >
            <IconSpaceWork nameWork={v.nameWork} size="sm" />
            <div className="flex flex-col">
              <p>{v.nameWork}</p>
              <div className="flex w-full items-center gap-x-2">
                <IconModay />
                <p className="text-sm">work managment</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
