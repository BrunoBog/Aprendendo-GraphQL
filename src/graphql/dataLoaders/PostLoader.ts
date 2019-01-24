import { PostModel, PostInstance } from "../../models/PostModel";


export class PostLoader {
    static batchUsers(Posts : PostModel, ids: number[]): Promise<PostInstance[]> {
        return Promise.resolve(
            Posts
            .findAll({
                where: {
                    id: { $in: ids }
                }
            })
        );
    }
}