import { ComposableResolver } from "./Composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import { GraphQLFieldResolver } from "graphql";

export const authResolver: ComposableResolver<any, ResolverContext> = 
(resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {
    return (parent, args, context, info) => {
        if(context.user|| context.authorization){
            return resolver(parent, args, context, info);
        }
        throw new Error("Unauthorazed, token not provided!");
    }
};