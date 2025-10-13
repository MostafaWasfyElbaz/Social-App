import DBRepository from "./db.repository";
import { IPost, IPostRepo ,IUser} from "../../common";
import { Model, HydratedDocument } from "mongoose";
import { Post, UserRepository } from "../";
export default class PostRepository
  extends DBRepository<IPost>
  implements IPostRepo
{
  constructor(protected override readonly model: Model<IPost> = Post) {
    super(model);
  }
  userRepository = new UserRepository();
  checkTags = async (tags: string[]): Promise<HydratedDocument<IUser>[]> => {
    const users = await this.userRepository.find({
      filter: {
        _id: { $in: tags },
      },projection:{_id:1}
    });
    if (!users) {
      return [];
    }
    return users;
  };
}
