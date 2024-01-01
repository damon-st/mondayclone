type RouteParams = {
  home: {};
  board: {
    idBoard?: string;
  };
  spaceWorkDetails: {
    idSpace: string;
    queryParametes?: Record<string, string>;
  };
};

// Definición de las rutas y sus parámetros
const routes: Record<keyof RouteParams, string> = {
  home: "/",
  board: "/board/:idBoard",
  spaceWorkDetails: "/board/space-work-details/:idSpace",
};

// Función para construir la URL
export function createRoute<T extends keyof RouteParams>(
  routeKey: T,
  params: RouteParams[T]
): string {
  const routePath = routes[routeKey];

  // Reemplazar los marcadores de posición en la ruta con los valores de los parámetros
  const url = Object.entries(params).reduce((acc, [key, value]) => {
    let tempUrl = acc.replace(`:${key}`, value as string);
    if (key == "queryParametes" && value) {
      tempUrl = `${tempUrl}?${new URLSearchParams(value).toString()}`;
    }
    return tempUrl;
  }, routePath);

  return url;
}
