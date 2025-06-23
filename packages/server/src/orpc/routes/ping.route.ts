import { os } from "@/orpc/implementer";

export const ping = os.ping.handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return { message: "pong" };
});
