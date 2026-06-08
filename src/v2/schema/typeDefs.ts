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
    image_url: String
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

  type Notification {
    notification_id: ID!
    receiver_id: ID!
    sender_id: ID!
    type: String!
    message: String!
    is_read: Boolean!
    post_id: ID!
    createdAt: String!
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

  type PageMeta {
    hasMore: Boolean!
    nextCursor: ID
  }

  type PostConnection {
    items: [Post!]!
    meta: PageMeta!
  }

  type Query {
    posts(limit: Int, cursor: ID, creator_id: ID, keyword: String): PostConnection!
    post(post_id: ID!): Post
    notifications: [Notification!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!, image_url: String): Post!
    updatePost(post_id: ID!, title: String, content: String): Post!
    deletePost(post_id: ID!): Boolean!
    addComment(post_id: ID!, message: String!): Comment!
    updateComment(comment_id: ID!, message: String!): Comment!
    deleteComment(comment_id: ID!): Boolean!
    likePost(post_id: ID!): Like!
    markNotificationAsRead: Boolean!
  }
  
  type Subscription {
    postAdded: Post!
    commentAdded: Comment!
    likeAdded: Like! 
  }
`;

export default typeDefs;