import type { User, UserModel } from "@acme/db/models/User";

class UserService {
  private readonly userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.get(id);
      return user;
    } catch (error) {
      console.error("Error getting User:", error);
      throw error;
    }
  }

  async createUser(user: User): Promise<void> {
    try {
      console.log("creating user");
      await this.userModel.create(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default UserService;
