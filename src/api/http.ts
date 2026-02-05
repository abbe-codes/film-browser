export type HttpResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

export async function httpGetJson<T>(url: string): Promise<HttpResult<T>> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: `Request failed (${res.status})`,
      };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, status: 0, message: msg };
  }
}
