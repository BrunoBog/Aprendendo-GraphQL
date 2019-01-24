import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/PortUtils";
import { authResolvers } from "../../composable/auth.resolver";
import { compose } from "../../composable/composable.resolver";
import { throwError } from "../../../utils/utils";

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
        createComment: compose(...authResolvers)((parent, { input }, { db, authuser }: { db: DbConnection, authuser }, info: GraphQLResolveInfo) => {
            input.user = authuser.id
            return db.sequelize.transaction( (t: Transaction ) => {
                    return db.Comment.create(input, {transaction: t})
                    .catch( () => new Error((`Cant create comment`)) )
            }).catch(handleError)
        }),
        updateComment: compose(...authResolvers)((parent,  input , { db, authuser }: { db: DbConnection, authuser }, info: GraphQLResolveInfo) => {
            let id = parseInt(authuser.id)
            return db.sequelize.transaction((t: Transaction)=> {
                return db.Comment.findById(id)
                    .then((comment)=>{
                        throwError(!comment, `comment with ${id} not found`);
                        input.id = id
                        return comment.update(input, {transaction: t})
                    })
            }).catch(handleError)
        }),
        deleteComment: compose(...authResolvers)((parent, input, { db, authuser }: { db: DbConnection, authuser }, info: GraphQLResolveInfo) => {
            let id = parseInt(authuser.id)
            return db.sequelize.transaction( (t: Transaction) => {
                return db.Comment.findById(id)
                    .then( (comment) => {
                        throwError(!comment , `comment with ${id} not found`);
                    })
                    .then( () => true)
                    .catch( () => false )
            }).catch(handleError)
        }),
    }


};