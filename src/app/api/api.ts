export type CreateApiResponse<data> = {
  data: data | null;
  status: "OK" | "ERROR";
  message: null | { message: string };
};

export const createApiResponse = <data>(data: data | null, status: "OK" | "ERROR", message: null | { message: string }) => {
  return Response.json({ data: data, status: status, message: message });
};
