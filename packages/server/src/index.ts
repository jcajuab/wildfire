import { app } from "@/app";

const port = Number(Bun.env.PORT ?? 3000);

console.log(`Listening on http://localhost:${port}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
