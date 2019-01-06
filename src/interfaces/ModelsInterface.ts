import { UserModel } from "../models/UserModel";
import { PostModel } from "../models/PostModel";
import { CommentModel } from "../models/commentModel";

export interface MOdelsInterface {
    User: UserModel;
    Post: PostModel;
    Comment: CommentModel;
    
}