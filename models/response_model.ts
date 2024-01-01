export interface ResponseModel<T> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}
