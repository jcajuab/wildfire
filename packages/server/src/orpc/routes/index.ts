import { os } from "@/orpc/implementer";
import { ping } from "@/orpc/routes/ping.route";

export const router = os.router({
  ping,
});
