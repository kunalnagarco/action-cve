import fetch, { Response as FetchResponse, RequestInit } from 'node-fetch'

type RequestOptions = Pick<RequestInit, 'method' | 'body' | 'headers'>
type Response = Pick<FetchResponse, 'headers' | 'json' | 'ok' | 'text'>

export const request = async (
  url: string,
  options?: RequestOptions,
): Promise<Response> =>
  fetch(url, {
    ...options,
  })
