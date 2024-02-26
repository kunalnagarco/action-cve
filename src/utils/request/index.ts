type RequestOptions = Pick<RequestInit, 'method' | 'body' | 'headers'>
type ResponseType = Pick<Response, 'headers' | 'json' | 'ok' | 'text'>

export const request = async (
  url: string,
  options?: RequestOptions,
): Promise<ResponseType> =>
  fetch(url, {
    ...options,
  })
