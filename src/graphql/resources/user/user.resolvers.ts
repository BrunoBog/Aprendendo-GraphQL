import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/PortUtils";
import { authResolver, authResolvers } from "../../composable/auth.resolver";
import { verifyTokenResolver } from "../../composable/verify-token.resolver";
import { throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";

export const userResolvers = {
    // Como não é um resolver trivial nos temos que implementar o resolver do campo Posts
    User: {
        posts: (parent: UserInstance, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                where: { author: parent.get('id') },
                limit: first,
                offset: offset
            }).catch(handleError)
        }
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.User
                .findAll({
                    limit: first,
                    offset: offset
                })
                .then((users) => {
                    if (users.length <= 0) throw new Error("Deu Ruim");
                    return users;
                }).catch(handleError);
        },

        user: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.User
                .findById(id)
                .then((user: UserInstance) => {
                    if (!user) throw new Error(`User with ${id} not found`);
                    return user;
                }).catch(handleError)
        },

        currentUser: compose(...authResolvers)((parent, args, { db, authUser }: { db: DbConnection, authUser }, info: GraphQLResolveInfo) => {
            let id = parseInt(authUser.id)
            return db.User
                .findById(id)
                .then((user: UserInstance) => {
                    throwError(!user, `User with ${id} not found`);
                    return user;
                }).catch(handleError)
        })
    },

    Mutation: {
        createUser: (parent, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .create(args.user, { transaction: t })
            }).catch(handleError)
        },

        updateUser: compose(...authResolvers)((parent, { input }, { db, authUser }: { db: DbConnection, authUser }, info: GraphQLResolveInfo) => {
            let id = parseInt(authUser.id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with ${id} not found`);
                        return user.update(input, { transaction: t });
                    })
            }).catch(handleError);
        }),

        updateUserPassword: compose(...authResolvers)((parent, { input }, { db, authUser }: { db: DbConnection, authUser }, info: GraphQLResolveInfo) => {
            let id = parseInt(authUser.id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with ${id} not found`);
                        return user.update(input, { transaction: t })
                            .then((user: UserInstance) => !!user);
                    })
            });
        }),

        userDelete: compose(...authResolvers)((parent, args, { db, authUser }: { db: DbConnection, authUser }, info: GraphQLResolveInfo) => {
            let id = parseInt(authUser.id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with ${id} not found`);
                        return user.destroy({ transaction: t })
                            .then(() => true)
                            .catch(() => false);
                    })
            }).catch(handleError);
        })
    }
};