import { DynamoDB } from "./client";
import { UserModel } from "./models/User";

class ModelsFactory {
  private static userModel: UserModel;
  public static getUserModel(): UserModel {
    if (!ModelsFactory.userModel) {
      const UserTable = process.env.TABLE_USERS;
      if (!UserTable) {
        throw new Error("UserTable name not defined");
      }
      ModelsFactory.userModel = new UserModel(
        DynamoDB.getInstance(),
        UserTable,
      );
    }
    return ModelsFactory.userModel;
  }
}
export { ModelsFactory };
