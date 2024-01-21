import { getGroupTaskByBoardId } from "@/lib/services/taks.service";
import { CheckCircle, ChevronDown, MoreHorizontal } from "lucide-react";
import { TitleTasks } from "./title_task";
import { TaskInputCreate } from "./taskt_input_create";
import { Task } from "./task";
import { TaskGroupHead } from "./task_group_head";
import { BoardUser } from "@prisma/client";
import { OptionsGroupTask } from "./options_group_task";
import { TaskFooter } from "./task_footer";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ButtonColapseGroupTask } from "./button_colapse_group_tasks";

interface GetTaksGroupPros {
  boardId: string;
  boardUsers: BoardUser[];
}
export const GetTaksGroup = async ({
  boardId,
  boardUsers,
}: GetTaksGroupPros) => {
  const groupTask = await getGroupTaskByBoardId(boardId);
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <>
      {groupTask.map((g) => (
        <div className="w-full  mt-2 mb-2" key={g.id}>
          <div className="group w-full flex  sticky top-0  bg-white z-30">
            <OptionsGroupTask
              priceForHour={g.priceForHour}
              paid={g.paid}
              idGroup={g.id}
              boardId={boardId}
              groupTasks={g}
            />
            <div className="w-[98%] ">
              <div className="w-full flex items-center space-x-2">
                <ButtonColapseGroupTask
                  expanded={g.expanded}
                  color={g.color}
                  idBoard={boardId}
                  idGroup={g.id}
                />
                <TitleTasks
                  id={g.id}
                  color={g.color}
                  title={g.title}
                  boardId={boardId}
                />
                {g.paid?.paid && (
                  <div className="flex items-center space-x-2">
                    <p className="text-lg">
                      {g.paid.paid ? "Se ha pagado este grupo" : ""}
                    </p>
                    <CheckCircle className="text-green-500 h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="min-w-[129.7rem]">
            <TaskGroupHead color={g.color} />
            {g.expanded && (
              <>
                {g.tasks.map((t, index) => (
                  <Task
                    key={t.id}
                    taks={t}
                    color={g.color}
                    index={index}
                    isLast={index === g.tasks.length}
                    boardUsers={boardUsers}
                    currentUser={userId}
                  />
                ))}
                <TaskInputCreate color={g.color} idGroupTasks={g.id} />
              </>
            )}
            <TaskFooter
              tasks={g.tasks}
              color={g.color}
              priceForHour={g.priceForHour}
            />
          </div>
        </div>
      ))}
    </>
  );
};

GetTaksGroup.skeleton = function () {
  return (
    <div
      role="status"
      className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
