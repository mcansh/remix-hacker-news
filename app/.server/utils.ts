type ResponseStub = {
  status: number | undefined;
  headers: Headers;
};

function validateSingleFetch(
  response: ResponseStub | undefined,
): asserts response is ResponseStub {
  if (!response) {
    throw new Error("No response object. Are you using Single Fetch?");
  }
}

export function redirectHelper(
  response: ResponseStub | undefined,
  location: string,
  status: number = 302,
) {
  validateSingleFetch(response);
  response.status = status;
  response.headers.set("Location", location);
  throw response;
}

export function responseHelper(
  response: ResponseStub | undefined,
  init: {
    status: number | undefined;
    headers?: Headers;
  },
) {
  validateSingleFetch(response);
  if (init.status) response.status = init.status;
  if (init.headers) {
    init.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }
  throw response;
}
