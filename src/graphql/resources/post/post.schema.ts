const postTypes = `

    type Post {
        id: ID!
        title: String!
        content: String!
        photo: String!
        createAt: String!
        updated: String!
        author: User!
        Comments(fisrt: Int, offset: Int): [Comment!] !
    }

    input PostInput{
        itle: String!
        content: String!
        photo: String!
        author: Int!
    }
`;

const postQueries = `
    posts(fist: Int, offset: Int):[Post!]! 
    post(id: ID!): Post
`;

const postMutations = `
    createPost(input: PostInput!): Post
    updatePost(id: ID!, input: PostInput!): Post
    deletePost(id: ID!): Boolean
`;

export{
    postTypes,
    postQueries,
    postMutations
}