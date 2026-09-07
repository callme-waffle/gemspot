import { describe, expect, it, vi } from 'vitest';
import { getJson } from './httpClient';

/** 성공 응답 스텁. 전역 fetch를 건드리지 않고 인자로만 주입한다. */
function respondWith(body: unknown, init?: ResponseInit): typeof fetch {
  return vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'content-type': 'application/json' },
        ...init,
      }),
    ),
  );
}

describe('getJson', () => {
  it('2xx JSON을 ok 결과로 돌려준다', async () => {
    const result = await getJson<{ id: string }>('https://example.test/x', {
      fetchImpl: respondWith({ id: 'a' }),
    });

    expect(result).toEqual({ ok: true, data: { id: 'a' } });
  });

  it('accept 헤더를 붙이고 호출부 헤더를 함께 실어 보낸다', async () => {
    const fetchImpl = respondWith({});
    await getJson('https://example.test/x', {
      fetchImpl,
      headers: { 'x-trace': 't-1' },
    });

    const init = vi.mocked(fetchImpl).mock.calls[0][1];
    expect(init?.headers).toMatchObject({
      accept: 'application/json',
      'x-trace': 't-1',
    });
  });

  it('비-2xx는 status 실패로 내리고 상태 코드를 보존한다', async () => {
    const result = await getJson('https://example.test/x', {
      fetchImpl: respondWith(
        {},
        { status: 503, statusText: 'Service Unavailable' },
      ),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('status');
      // 도메인이 재시도 여부를 정하려면 코드가 그대로 올라와야 한다.
      expect(result.error).toMatchObject({ status: 503 });
    }
  });

  it('전송 실패는 network로 분류한다', async () => {
    const result = await getJson('https://example.test/x', {
      fetchImpl: vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    });

    expect(result).toEqual({
      ok: false,
      error: { kind: 'network', message: 'Failed to fetch' },
    });
  });

  it('타임아웃은 network와 갈라서 timeout으로 분류한다', async () => {
    // AbortSignal.timeout()이 끊을 때 나오는 그 오류 모양 그대로.
    const timeoutError = new Error('The operation was aborted due to timeout');
    timeoutError.name = 'TimeoutError';

    const result = await getJson('https://example.test/x', {
      fetchImpl: vi.fn(() => Promise.reject(timeoutError)),
    });

    expect(result).toEqual({
      ok: false,
      error: { kind: 'timeout', message: timeoutError.message },
    });
  });

  it('본문이 JSON이 아니면 parse 실패로 내린다 — 2xx라도', async () => {
    const result = await getJson('https://example.test/x', {
      fetchImpl: vi.fn(() =>
        Promise.resolve(
          new Response('<html>maintenance</html>', { status: 200 }),
        ),
      ),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('parse');
    }
  });
});
