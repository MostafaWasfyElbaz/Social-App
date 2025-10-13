import { HydratedDocument } from "mongoose";
import { IUser } from "../";

export interface IPostRepo {
    checkTags(tags: string[]): Promise<HydratedDocument<IUser>[]>;
}
