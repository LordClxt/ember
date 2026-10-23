import { ApiError, apiFetch } from './api-client'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

describe('apiFetch', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('builds the URL with query params and parses JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      apiFetch('items', { query: { page: 2, skip: undefined } }),
    ).resolves.toEqual({ ok: true })
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'http://localhost:3000/api/v1/items?page=2',
    )
  })

  it('maps API error bodies to ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          json({ statusCode: 400, message: ['name should not be empty'] }, 400),
        ),
    )

    await expect(
      apiFetch('items', { method: 'POST', body: {} }),
    ).rejects.toEqual(new ApiError(400, 'name should not be empty'))
  })

  it('maps network failures to status 0', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('fetch failed')),
    )

    await expect(apiFetch('items')).rejects.toMatchObject({ status: 0 })
  })

  it('returns undefined for 204 responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    )

    await expect(
      apiFetch('items/1', { method: 'DELETE' }),
    ).resolves.toBeUndefined()
  })
})
