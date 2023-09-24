import { ModelsFactory } from "@acme/db";

import UserService from "./src/userService";

export type { QuoteCard, User } from "@acme/db/models/User";

class ServicesFactory {
  private static userService: UserService;
  public static getUserService(): UserService {
    if (!ServicesFactory.userService) {
      ServicesFactory.userService = new UserService(
        ModelsFactory.getUserModel(),
      );
    }
    return ServicesFactory.userService;
  }
}
export default ServicesFactory;
