type ResponseStub = {
  status: number | undefined;
  headers: Headers;
};

export function redirectHelper(
  response: ResponseStub,
  location: string,
  status: number = 302,
) {
  response.status = status;
  response.headers.set("Location", location);
  throw response;
}

export function responseHelper(
  response: ResponseStub,
  init: {
    status: number | undefined;
    headers?: Headers;
  },
) {
  if (init.status) response.status = init.status;
  if (init.headers) {
    init.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }
  throw response;
}
