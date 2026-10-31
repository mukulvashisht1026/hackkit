export async function api<T = any>(path: string, body?: unknown, form?: FormData): Promise<T> {
  const res = await fetch("/api" + path, form
    ? { method: "POST", body: form }
    : body === undefined
      ? undefined
      : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || res.statusText);
  return res.json();
}
