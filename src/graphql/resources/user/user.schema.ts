const userTypes = `
    #Assim se coloca comentarios no GraphQl como documentação adicional
    type User {
        #Assim define o comentario para o campo
        id: ID!
        name: String!
        email: String!
        photo: String
        createdAt: String!
        updatedAt: String
        posts(fisrt: Int, offset: Int): [Post!]!
    }

    input userCreateInput {
        name: String!
        email: String!
        password: String!
    }

    input UserUpdateInput {
        name: String!
        email: String!
        photo: String!
    }

    input userUpdatePasswordInput {
        password: String!
    }
`;

const userQuerys = `
    users(first: Int, offset: Int): [User!]
    user(id: ID!): User
    currentUser: User
`;

const userMutations = `
    createUser(user: userCreateInput!): User
    updateUser(input: UserUpdateInput!): User
    updateUserPassword(, input: userUpdatePasswordInput! ): Boolean
    userDelete: Boolean
`;

export {
    userTypes,
    userQuerys,
    userMutations
}