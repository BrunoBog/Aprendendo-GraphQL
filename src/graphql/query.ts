import { commentQuerys } from './resources/comment/comment.schema';
import { postQueries } from './resources/post/post.schema';
import{userQuerys} from './resources/user/user.schema'

const Query = `
    type Query{
        ${commentQuerys}
        ${postQueries}
        ${userQuerys}
    }
`;

export {Query};