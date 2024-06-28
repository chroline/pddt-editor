export default async function callRedis({ route, body }: { route: string; body?: any }) {
  const data = await fetch(process.env.KV_REST_API_URL + "/" + route, {
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  }).then(response => response.json());

  if (typeof data.result !== "undefined") return data.result as any;

  return data as any;
}
