import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/PortUtils";
import { compose } from "../../composable/Composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { throwError } from "../../../utils/utils";

export const postResolvers = {

    Post: {
        author: (parent, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.User.findById(parent.get('author')).catch(handleError);
        },

        comment: (parent, { fisrt = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: parent.get('id') },
                limit: fisrt,
                offset: offset
            }).catch(handleError)
        }

    },

    Query: {
        // Este é o padrão de criação: => posts:(parent, args, context, info) =>{
        posts: (parent, { fisrt = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findAll({
                    limit: fisrt,
                    offset: offset
                }).catch(handleError);
        },
        postByID: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.Post
                .findById(id)
                .then((post: PostInstance) => {
                    if (!post) throw new Error(`Post with ${id} not found`);
                    return post
                }).catch(handleError)
        }
    },

    Mutation: {


        createPost: compose(...authResolvers)((parent, { input }, { db, authuser }: { db: DbConnection, authuser }, info: GraphQLResolveInfo) => {
            input.author = authuser.id
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t });
            }).catch(handleError)
        }),

        updatePost: compose(...authResolvers)((parent, { id, input }, { db, authuser }: { db: DbConnection, authuser }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        throwError(!post,`Post with ${id} not found`);
                        throwError(post.get('author') != authuser.id, "Unauthorized!, only post owner can delete posts")
                        input.author = authuser.id
                        return post.update(input, { transaction: t });
                    });
            }).catch(handleError)
        }),

        deletePost: compose(...authResolvers)((parent, { id }, { db, authuser }: { db: DbConnection, authuser }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        throwError(!post ,`Post with ${id} not found`);
                        throwError(post.get('author') != authuser.id, "Unauthorized!, only post owner can delete posts")
                        return post.destroy()
                            .then(() => true)
                            .catch(() => false)
                    })
            }).catch(handleError)
        })
    },
};

