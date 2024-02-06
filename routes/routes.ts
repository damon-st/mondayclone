type RouteParams = {
  home: {};
  board: {
    idSpaceWork?: string;
    idBoard?: string;
  };
  spaceWork: {
    idSpaceWork: string;
  };
  spaceWorkDetails: {
    idSpaceWork: string;
    idSpace: string;
    queryParametes?: Record<string, string>;
  };
};

// Definición de las rutas y sus parámetros
const routes: Record<keyof RouteParams, string> = {
  home: "/",
  spaceWork: "/board/:idSpaceWork",
  board: "/board/:idSpaceWork/:idBoard",
  spaceWorkDetails: "/board/:idSpaceWork/space-work-details/:idSpace",
};

// Función para construir la URL
export function createRoute<T extends keyof RouteParams>(
  routeKey: T,
  params: RouteParams[T]
): string {
  const routePath = routes[routeKey];

  // Extraer los marcadores de posición de la ruta
  const placeholders = routePath.match(/:[a-zA-Z0-9_]+/g) || [];

  // Reemplazar los marcadores de posición en la ruta con los valores de los parámetros
  let url = placeholders.reduce((acc, placeholder) => {
    const key = placeholder.substr(1); // Eliminar el ":" al principio
    const value = params[key as keyof typeof params] || "";
    return acc.replace(new RegExp(placeholder, "g"), value.toString());
  }, routePath);

  if ((params as any)?.queryParametes) {
    const queryParams = new URLSearchParams(
      (params as any)?.queryParametes
    ).toString();
    url += `?${queryParams}`;
  }
  return url;
}
