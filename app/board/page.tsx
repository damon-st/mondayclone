import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SpaceWork } from "@prisma/client";
import {
  createSpaceWork,
  getOneSpacesWorkUser,
} from "@/lib/services/work_pasce.service";
import { createUserInfo, getUserInfo } from "@/lib/services/users.service";
import { createRoute } from "@/routes/routes";

const BoradPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const user = await currentUser();
  let spacesWorks: SpaceWork | null = null;
  spacesWorks = await getOneSpacesWorkUser(userId);

  if (!spacesWorks) {
    spacesWorks = await createSpaceWork({
      descriptionWork: "",
      nameWork: "Espacio de trabajo principal",
      userId,
    });
  }

  let userInfo = await getUserInfo(userId);
  if (!userInfo) {
    userInfo = await createUserInfo({
      email: `${user?.emailAddresses[0].emailAddress}`,
      name: `${user?.firstName} ${user?.lastName}`,
      userId,
      photo: user?.imageUrl,
    });
  }

  return redirect(
    createRoute("spaceWork", {
      idSpaceWork: spacesWorks.id,
    })
  );
};
export default BoradPage;
