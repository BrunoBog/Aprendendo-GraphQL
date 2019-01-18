import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/PortUtils";

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


        createPost: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t });
            }).catch(handleError)
        },

        updatePost: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        if (!post) throw new Error(`Post with ${id} not found`);
                        return post.update(input, { transaction: t });
                    });
            }).catch(handleError)
        },

        deletePost: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        if (!post) throw new Error(`Post with ${id} not found`);
                        return post.destroy()
                            .then(() => true)
                            .catch(() => false)
                    })
            }).catch(handleError)
        }
    },

    // find: (id: number | string, db: DbConnection, callback: Function) => {
    //     return db.sequelize.transaction((t: Transaction) => {
    //         return db.Post
    //             .findById(id)
    //             .then((post: PostInstance) => { return callback(post, t); })
    //             .catch(Error);
    
    //     }).catch(handleError)
    // }
};

