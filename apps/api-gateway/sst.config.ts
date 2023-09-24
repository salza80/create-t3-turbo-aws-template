import type { SSTConfig } from "sst";

import { API } from "./stacks/apiGatewayStack";

export default {
  config(_input) {
    return {
      name: "parallel-api-gateway",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
