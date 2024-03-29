type Action = {
  type: string;
  payload?: Payload;
  error?: any;
};

type Payload = {
  params?: any;
  callback?: (data?: any) => any;
  errorCallback?: (error?: any) => any;
  response?: any;
};

type ResponseGenerator = {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
};

export type { Action, Payload, ResponseGenerator };
