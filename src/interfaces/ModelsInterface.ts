import { UserModel } from "../models/UserModel";
import { PostModel } from "../models/PostModel";
import { CommentModel } from "../models/commentModel";
import { DataLoaders } from "./DataLoadersInterface";

export interface MOdelsInterface {
    User: UserModel;
    Post: PostModel;
    Comment: CommentModel;
    Dataloaders: DataLoaders;
    
}