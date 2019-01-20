import { DbConnection } from "./DbConnectionInterface";
import { AuthUser } from "./Authuserinterface";

export interface ResolverContext{

    db?: DbConnection;
    authorization?: string;
    user?: AuthUser;
}