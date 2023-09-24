import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "../../../../packages/api";

export const api = createTRPCReact<AppRouter>();

export {
  type RouterInputs,
  type RouterOutputs,
} from "../../../../packages/api";
