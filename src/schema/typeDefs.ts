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
    likesCount: Int!
    commentsCount: Int!
    comments: [Comment!]!
    likes: [Like!]!
  }
  
  type Comment {
    comment_id: ID!
    message: String!
    user: User!
    post: Post!
  }

  type Like {
    like_id: ID!
    user: User!
    post: Post!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    posts(limit: Int, offset: Int, creator_id: ID, keyword: String): [Post!]!
    post(post_id: ID!): Post
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!): Post!
    updatePost(post_id: ID!, title: String, content: String): Post!
    deletePost(post_id: ID!): Boolean!
    addComment(post_id: ID!, message: String!): Comment!
    updateComment(comment_id: ID!, message: String!): Comment!
    deleteComment(comment_id: ID!): Boolean!
    likePost(post_id: ID!): Like!
  }
`;

export default typeDefs;