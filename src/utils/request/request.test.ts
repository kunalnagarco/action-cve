import { request } from '.'

global.fetch = jest.fn(() => Promise.resolve({})) as jest.Mock

const URL = 'someUrl'

describe('request', () => {
  it('request: should perform a GET request with empty options object', async () => {
    await request(URL)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(URL, {})
  })

  it('request: should perform a POST request with body and headers', async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        key1: 'value1',
      }),
      headers: {
        Authorization: 'Bearer token',
      },
    }
    await request(URL, options)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(URL, options)
  })
})
