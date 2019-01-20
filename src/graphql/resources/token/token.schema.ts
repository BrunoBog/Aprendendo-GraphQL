const tokenTypes = `
    type Token {
        token: String!
    }
`;

const tokenMutations = `
CreateToken(email: String!, password: String!): Token
`

export {
    tokenTypes,
    tokenMutations
}