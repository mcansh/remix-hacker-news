type ResponseStub = {
  status: number | undefined;
  headers: Headers;
};

export function responseHelper(
  response: ResponseStub | undefined,
  init: {
    status: number | undefined;
    headers?: Headers;
  }
) {
  if (response) {
    if (init.status) response.status = init.status;
    if (init.headers) {
      init.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
    }
    throw response;
  }

  throw new Response(null, init);
}
