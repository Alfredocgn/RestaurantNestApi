export interface HttpResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
