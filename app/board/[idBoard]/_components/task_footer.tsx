import { CustomToolpip } from "@/components/custom_toltip";
import { colorStatusTasks } from "@/constants/constants";
import {
  calculePercentagePriorityTasks,
  calculePercentageStatusTasks,
  calculePriceWithMinutes,
  formatDate,
  formatMinutesToHm,
  formatPrice,
} from "@/lib/utils";
import { CalculePercentageI } from "@/models/calcule_percentage";
import { StatusTaks, Tasks, TasksTimesWorks } from "@prisma/client";
import { differenceInMinutes } from "date-fns";

interface TaskFooterProps {
  color: string;
  tasks: (Tasks & {
    tasksTimesWorks: TasksTimesWorks[];
  })[];
}
export const TaskFooter = ({ color, tasks }: TaskFooterProps) => {
  let fecha = "";
  let fechaRange = "-";
  let groupStatus: Array<CalculePercentageI> = [];
  let groupPriority: Array<CalculePercentageI> = [];

  let total = "0";

  let tasksTimesWorks = "";

  if (tasks.length > 0) {
    fecha = formatDate(tasks[tasks.length - 1].dateInit, "dd MMM");
    if (tasks.length > 1) {
      const taskSort = tasks.sort(
        (a, b) => a.dateInit.getTime() - b.dateInit.getTime()
      );
      const dateInit = taskSort[0].dateInit;
      const dateEnd = taskSort[taskSort.length - 1].dateInit;
      fecha = `${formatDate(dateInit, "dd")} - ${formatDate(
        dateEnd,
        "dd MMM"
      )}`;
    }
    groupStatus = calculePercentageStatusTasks(tasks);
    groupPriority = calculePercentagePriorityTasks(tasks);
    total = formatPrice(
      tasks.reduce((acc, p) => {
        return acc + p.budget;
      }, 0)
    );
    let dateInit: Array<Date> = [];
    let dateEnd: Array<Date> = [];
    for (const iterator of tasks) {
      if (!iterator.schedule) {
        continue;
      }
      dateInit.push(iterator.schedule.dateInit);
      dateEnd.push(iterator.schedule.dateEnd);
    }
    if (dateInit.length > 0 && dateEnd.length > 0) {
      dateInit = dateInit.sort((a, b) => a.getTime() - b.getTime());
      dateEnd = dateEnd.sort((a, b) => a.getTime() - b.getTime());
      fechaRange = `${formatDate(dateInit[0], "dd")} - ${formatDate(
        dateEnd[dateEnd.length - 1],
        "dd MMM"
      )}`;
    }
    let priceT = 0;
    let minutes = 0;
    for (const t of tasks) {
      const f = t.tasksTimesWorks.filter((v) => v.timeEnd);
      const value = f.reduce(
        (pre, acc) => {
          const minutes = differenceInMinutes(acc.timeEnd!, acc.timeInit);
          const price = calculePriceWithMinutes(
            5,
            differenceInMinutes(acc.timeEnd!, acc.timeInit)
          );

          return { price: pre.price + price, minute: pre.minute + minutes };
        },
        { price: 0, minute: 0 }
      );
      priceT += value.price;
      minutes += value.minute;
    }

    if (priceT > 0) {
      tasksTimesWorks = `$${formatPrice(priceT)} ${formatMinutesToHm(minutes)}`;
    }
  }

  return (
    <div className="w-full h-10 flex items-center ">
      <div className="w-[25.5rem] h-10 sticky left-0 bg-white z-20 border-grisHover border-r rounded-b-sm"></div>
      <div className="flex items-center">
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm rounded-l-sm"></div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm flex items-center justify-center">
          <div
            className="w-[80%] h-[70%] rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
          >
            {fecha}
          </div>
        </div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm flex items-center justify-center">
          {groupStatus.length == 0 ? (
            <div
              className="w-[90%] h-[80%] flex"
              style={{ backgroundColor: colorStatusTasks.notInit }}
            ></div>
          ) : (
            <div className="w-[90%] h-[80%] flex">
              {groupStatus.map((v) => (
                <CustomToolpip key={v.color} msg={v.msg}>
                  <div
                    style={{ backgroundColor: v.color, width: v.process + "%" }}
                  ></div>
                </CustomToolpip>
              ))}
            </div>
          )}
        </div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm flex items-center justify-center">
          {groupPriority.length == 0 ? (
            <div
              className="w-[90%] h-[80%] flex"
              style={{ backgroundColor: colorStatusTasks.notInit }}
            ></div>
          ) : (
            <div className="w-[90%] h-[80%] flex">
              {groupPriority.map((v) => (
                <CustomToolpip key={v.color} msg={v.msg}>
                  <div
                    style={{ backgroundColor: v.color, width: v.process + "%" }}
                  ></div>
                </CustomToolpip>
              ))}
            </div>
          )}
        </div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm "></div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm flex items-center justify-center flex-col">
          <p className="text-sm">${total}</p>
          <p className="text-xs text-azul">Total</p>
        </div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm "></div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm flex items-center justify-center">
          <div
            className="w-[80%] h-[70%] rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
          >
            {fechaRange}
          </div>
        </div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm rounded-r-sm"></div>
        <div className="w-[10.4rem] h-10 border-b border-gris border-r border-l shadow-sm rounded-r-sm flex items-center justify-center">
          {tasksTimesWorks}
        </div>
      </div>
    </div>
  );
};
