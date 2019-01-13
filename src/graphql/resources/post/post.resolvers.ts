import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { decodeBase64 } from "bcryptjs";
import { Transaction } from "sequelize";

const postResolvers = {

    Post: {
        author: (parent, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.User.findById(parent.get('author'));
        },

        comment: (parent, { fisrt = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: parent.get('id') },
                limit: fisrt,
                offset: offset
            })
        }

    },

    Query: {
        // Este é o padrão de criação: => posts:(parent, args, context, info) =>{
        posts: (parent, { fisrt = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findAll({
                    limit: fisrt,
                    offset: offset
                });
        },
        postByID: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post
                .findById(id)
                .then((post: PostInstance) => {
                    if (!post) throw new Error(`Post with ${id} not found`);
                    return post
                })
        }
    },

    Mutations: {


        createPost: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t });
            })
        },

        updatePost: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        if (!post) throw new Error(`Post with ${id} not found`);
                        return post.update(input, { transaction: t });
                    });
            })
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
            })
        }
    }
};

const findWithTransaction = (id: number | string, db: DbConnection, callback: Function) => {
    return db.sequelize.transaction((t: Transaction) => {
        return db.Post
            .findById(id)
            .then((post: PostInstance) => {
                // tratamentos de erro aqui
                return callback(post, t);
            }).catch(Error);

    }
}