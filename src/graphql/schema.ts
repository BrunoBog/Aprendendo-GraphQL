import { makeExecutableSchema } from 'graphql-tools'
import { userInfo } from 'os';
const Users: any[] = [
    {
        id: '1',
        name: 'jhon',
        email: 'nada@nada.com'
    }
];

const typeDefs = `
    type User{
        id: String!
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]
    }

    type Mutation {
        createUser(name:String!, email:String!): User
    }
    `;

const resolvers = {
    User: {
        id: (user)=> user.id,
        name: (parent)=> parent.name,
        email: (parent)=> parent.email,
    },
    Query: {
        allUsers: () => Users
    },
    Mutation: {
        createUser: (parent, args) => {
            const newUser = Object.assign({id: Users.length +1}, args )
            Users.push(newUser);
            return newUser;
        }
    }
};

export default makeExecutableSchema({ typeDefs, resolvers });