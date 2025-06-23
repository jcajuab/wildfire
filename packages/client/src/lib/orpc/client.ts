import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "@wildfire/shared/contracts";

type Client = JsonifiedClient<ContractRouterClient<typeof contract>>;

// TODO https://orpc.unnoq.com/docs/plugins/client-retry#client-retry-plugin
export const client = createORPCClient<Client>(
  new OpenAPILink(contract, {
    url: `${window.location.origin}/api`,
  }),
);
