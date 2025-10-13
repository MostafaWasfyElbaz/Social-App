import DBRepository from "../Repository/db.repository";
import { User } from "../index";
import { IUser, IUserRepo } from "../../common";
import { HydratedDocument, Model } from "mongoose";
import { userExistError } from "../../utils";

export default class UserRepository
  extends DBRepository<IUser>
  implements IUserRepo
{
  constructor(protected override readonly model: Model<IUser> = User) {
    super(model);
  }
  findUserByEmail = async (
    email: string
  ): Promise<HydratedDocument<IUser> | null> => {
    return this.model.findOne({ email });
  };

  createUser = async (
    user: Partial<IUser>
  ): Promise<HydratedDocument<IUser>> => {
    const isExist = await this.findUserByEmail(user.email as string);
    if (isExist) {
      throw new userExistError();
    }
    return this.model.create(user);
  };
}
