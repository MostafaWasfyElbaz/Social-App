import DBRepository from "../Repository/db.repository";
import { User } from "../index";
import { IUser } from "../../common/index";
import { HydratedDocument, Model } from "mongoose";
import { userExistError } from "../../utils/index";

export default class UserRepository extends DBRepository<IUser> {
  constructor(protected override readonly model: Model<IUser> = User) {
    super(model);
  }
  async findUserByEmail(
    email: string
  ): Promise<HydratedDocument<IUser> | null> {
    return this.model.findOne({ email });
  }

  async createUser(user: Partial<IUser>): Promise<HydratedDocument<IUser>> {
    const isExist = await this.findUserByEmail(user.email as string);
    if (isExist) {
      throw new userExistError();
    }
    return this.model.create(user);
  }
}
