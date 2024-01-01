import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  differenceInDays,
  formatDistanceToNow,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { es } from "date-fns/locale";
import { Priority, StatusTaks, Tasks } from "@prisma/client";
import { colorPriorityTasks, colorStatusTasks } from "@/constants/constants";
import { TypeActivityBoard } from "@/models/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getElementRandom(list: Array<any>) {
  return list[Math.floor(Math.random() * list.length)];
}

export function formatDate(date: Date, patter = "dd/MM/yyyy") {
  return format(date, patter, {
    locale: es,
  });
}
export function compareDates(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function calculeDiferenceInDays(date1: Date, date2: Date) {
  const dateRigth = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  const dateLefh = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  );
  return differenceInDays(dateRigth, dateLefh);
}

export function getStatusTaskTXT(status: StatusTaks) {
  let statusTxt = "";
  switch (status) {
    case "notInit":
      statusTxt = "No iniciado";
      break;
    case "stop":
      statusTxt = "Detenido";
      break;
    case "inProgress":
      statusTxt = "En curso";
      break;
    case "completed":
      statusTxt = "Listo";
      break;
    default:
      break;
  }
  return statusTxt;
}
export function getPriorityTaskTXT(priority: Priority) {
  let priorityTxt: string = "";
  switch (priority) {
    case "none":
      priorityTxt = "";
      break;
    case "slow":
      priorityTxt = "Baja";
      break;
    case "midle":
      priorityTxt = "Media";
      break;
    case "higth":
      priorityTxt = "Alta";
      break;
    case "critical":
      priorityTxt = "Critica";
      break;
    default:
      break;
  }
  return priorityTxt;
}

export function calculePercentageStatusTasks(tasks: Array<Tasks>) {
  // Crear un objeto para almacenar la cantidad de cada estado
  let conteoPorStatus: any = {};

  // Contar la cantidad de cada estado
  tasks.forEach((objeto) => {
    const status = objeto.status;
    conteoPorStatus[status] = (conteoPorStatus[status] || 0) + 1;
  });

  // Calcular el porcentaje de cada estado
  const porcentajes = [];
  for (const status in conteoPorStatus) {
    const total = tasks.filter((e) => e.status === status).length;
    const statusTxt = getStatusTaskTXT(status as StatusTaks);
    const process = Math.round((conteoPorStatus[status] / tasks.length) * 100);
    porcentajes.push({
      process: process,
      total: total,
      key: status,
      color: colorStatusTasks[status as StatusTaks],
      msg: `${statusTxt} ${total}/${tasks.length} ${process}%`,
    });
  }
  return porcentajes.sort((a, b) => b.process - a.process);
}

export function calculePercentagePriorityTasks(tasks: Array<Tasks>) {
  // Crear un objeto para almacenar la cantidad de cada estado
  let conteoPorStatus: any = {};

  // Contar la cantidad de cada estado
  tasks.forEach((objeto) => {
    const status = objeto.priority;
    conteoPorStatus[status] = (conteoPorStatus[status] || 0) + 1;
  });

  // Calcular el porcentaje de cada estado
  const porcentajes = [];
  for (const status in conteoPorStatus) {
    const total = tasks.filter((e) => e.priority === status).length;
    const statusTxt = getPriorityTaskTXT(status as Priority);
    const process = Math.round((conteoPorStatus[status] / tasks.length) * 100);
    porcentajes.push({
      process: process,
      total: total,
      key: status,
      color: colorPriorityTasks[status as Priority],
      msg: `${statusTxt} ${total}/${tasks.length} ${process}%`,
    });
  }
  return porcentajes.sort((a, b) => b.process - a.process);
}

export const formatPrice = (total: number) => {
  const formatoNumero = new Intl.NumberFormat("en-US", {
    style: "decimal", // Puedes usar 'currency' para formato de moneda
    maximumFractionDigits: 2,
  });

  const numeroFormateado = formatoNumero.format(total);
  return numeroFormateado;
};

export function timeAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}
export function timeAgoInDays(date: Date) {
  const diferenciaEnHoras = differenceInHours(new Date(), date);
  const diferenciaEnDias = differenceInDays(new Date(), date);
  let resultado;

  if (diferenciaEnHoras < 24) {
    if (diferenciaEnHoras < 1) {
      resultado = `${differenceInMinutes(new Date(), date)}m`;
    } else {
      resultado = `${diferenciaEnHoras}H`;
    }
  } else {
    resultado = `${diferenciaEnDias}D`;
  }
  return resultado;
}

export function getTypeActivityBoardTXT(value: TypeActivityBoard) {
  let txt: string = "";
  switch (value) {
    case TypeActivityBoard.create:
      txt = "Crear tarea";
      break;
    case TypeActivityBoard.update:
      txt = "Actualizar tarea";
      break;
    case TypeActivityBoard.title:
      txt = "Titulo";
      break;
    case TypeActivityBoard.userRes:
      txt = "Responsable";
      break;
    case TypeActivityBoard.dateInit:
      txt = "Fecha";
      break;
    case TypeActivityBoard.status:
      txt = "Estado";
      break;
    case TypeActivityBoard.priority:
      txt = "Prioridad";
      break;
    case TypeActivityBoard.notes:
      txt = "Notas";
      break;
    case TypeActivityBoard.budget:
      txt = "Presupuesto";
      break;
    case TypeActivityBoard.files:
      txt = "Archivos";
      break;
    case TypeActivityBoard.schedule:
      txt = "Cronograma";
      break;

    default:
      break;
  }
  return txt;
}
