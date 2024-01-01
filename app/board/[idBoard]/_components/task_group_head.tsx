import { Square } from "lucide-react";

interface TaskGroupHeadPros {
  color: string;
}

export const TaskGroupHead = ({ color }: TaskGroupHeadPros) => {
  return (
    <div className="w-full flex items-center sticky top-10 bg-white z-30">
      <div className="w-[2.2rem] flex items-center justify-center"></div>
      <div className="ml-[2.2rem] ">
        <div className="w-full flex items-center border-b border-grisHover border-t">
          <div
            style={{ borderLeftColor: color }}
            className="border-l-4 rounded-t-sm  flex items-center sticky left-0 bg-white z-20"
          >
            <div className="w-10 border-r border-grisHover flex items-center justify-center h-10 ">
              <Square className="w-5 h-5 text-grisHover" />
            </div>
            <div className="w-[20.7rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Tarea</p>
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Responsable</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Fecha</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Estado</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Prioridad</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Notas</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Presupuesto</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Archivos</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Cronograma</p>
            </div>
            <div className="w-[10.4rem] flex items-center h-10 border-r border-grisHover justify-center">
              <p className="text-sm">Ultima actualizacion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
