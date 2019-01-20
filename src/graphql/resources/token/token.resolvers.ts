import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { NoUnusedFragments } from "graphql/validation/rules/NoUnusedFragments";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../../utils/utils";

export const tokenResolvers= {
    Mutation: {
        createToken: (parent, {email, password}, { db }: { db: DbConnection }) => {
            return db.User.findOne({
                where: {email: email},
                attributes: ['id', 'password']
            }).then((user: UserInstance) => {
                // if (!user || !user.isPassword(user.get('password'), password)){ throw new Error("Unathorizes, worong wmail or password");}
                if(!user) throw new Error("Erro o user");
                if (!user.isPassword(user.get('password'), password)) throw new Error("Errow rude esse password");
                const payload= { sub: user.get('id') }
                return {
                    token: jwt.sign(payload, JWT_SECRET)
                }
            })
        }
    }
};