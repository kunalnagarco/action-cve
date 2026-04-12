type RequestOptions = Pick<RequestInit, 'method' | 'body' | 'headers'>
type ResponseType = Pick<Response, 'headers' | 'json' | 'ok' | 'text'>

export const request = async (
  url: string,
  options?: RequestOptions,
): Promise<ResponseType> => {
  const response = await fetch(url, { ...options })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response
}
