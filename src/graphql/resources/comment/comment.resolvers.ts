import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/PortUtils";

export const commentResolvers = {

    Comment: {
        user: (parent, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.User
                .findById(parent.get('user'))
                .catch(handleError)
        },

        post: (parent, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findById(parent.get('post')).catch(handleError)
        }
    },

    Query: {
        commentsByPost: (parent, { postid, first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Comment
                .findAll({
                    where: {
                        post: postid,
                        limit: first,
                        offset: offset
                    }
                }).catch(handleError);
        }
    },

    Mutation: {
        createComment: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction( (t: Transaction ) => {
                    return db.Comment.create(input, {transaction: t})
                    .catch( () => new Error((`Cant create comment`)) )
            }).catch(handleError)
        },
        updateComment: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction)=> {
                return db.Comment.findById(id)
                    .then((comment)=>{
                        if (!comment) throw Error((`comment with ${id} not found`));
                        return comment
                    })
            }).catch(handleError)
        },
        deleteComment: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction( (t: Transaction) => {
                return db.Comment.findById(id)
                    .then( (comment) => {
                        if (!comment) throw Error((`comment with ${id} not found`));
                    })
                    .then( () => true)
                    .catch( () => false )
            }).catch(handleError)
        },
    }


};