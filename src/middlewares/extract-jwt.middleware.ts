import db from './../models'
import * as jwt from 'jsonwebtoken'
import { RequestHandler, Request, Response, NextFunction } from "express";
import { JWT_SECRET } from '../utils/utils';
import { UserInstance } from '../models/UserModel';

export const extractJwtMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        let authorization: string = req.get('authorization'); // pegando o valor authorization do header =P
        let token: string = authorization ? authorization.split(' ')[1] : undefined;

        req['context'] = {};
        req['context']['authorization'] = authorization;

        //verifico se existe o token, caso não exista eu chamo o proximo middleware e saio desse
        if (!token) {return next();}; // como next retorna void eu posso chamar dentro de uma outra função que retorna void

        jwt.verify(token, JWT_SECRET, (error, decoded : any)=> {
            if (error) return next();

            db.User.findById(decoded.sub, {
                attributes: ['id', 'email']
            }).then((user: UserInstance) => {
                if (user){
                    req['context']['user'] = {
                        id: user.get('id'),
                        email: user.get('email')
                    }
                }
                return next();
            })
        })

    };
}
//Existe uma lib chamada Passport que faz essa treta de retirar o token da requisição e etc.....