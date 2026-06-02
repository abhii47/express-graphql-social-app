const typeDefs = `
  type User {
    user_id: ID!
    name: String!
    email: String!
  }

  type Post {
    post_id: ID!
    title: String!
    content: String!
    creator: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    me: User
    posts: [Post!]!
    post(post_id: ID!): Post
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!): Post!
  }
`;

export default typeDefs;