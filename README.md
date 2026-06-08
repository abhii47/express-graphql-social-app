# Express GraphQL API

A production-ready GraphQL API built with Node.js, TypeScript, and Apollo Server featuring real-time subscriptions, offline notifications, and API versioning.

---

## Tech Stack

- **Runtime**: Node.js, TypeScript
- **Server**: Express, Apollo Server
- **Database**: MySQL, Sequelize ORM
- **Real-time**: GraphQL Subscriptions, WebSocket (graphql-ws)
- **Security**: JWT Authentication, Helmet, Rate Limiting
- **Validation**: Zod
- **Logging**: Winston
- **Performance**: DataLoader (N+1 optimization)

---

## Features

- **Authentication** — JWT-based auth for HTTP and WebSocket connections
- **Real-time Subscriptions** — postAdded, commentAdded, likeAdded events
- **Topic-based Pub/Sub** — notifications routed to specific users
- **Offline Notifications** — missed events stored in DB when user is offline
- **DataLoader** — batched DB queries to solve N+1 problem
- **Cursor-based Pagination** — efficient pagination for posts
- **Input Validation** — Zod schema validation on all mutations
- **Rate Limiting** — express-rate-limit to prevent abuse
- **API Versioning** — `/v1/graphql` and `/v2/graphql` endpoints
- **Security** — Helmet security headers
- **Logging** — Winston with file and console transports

---

## Project Structure

```
src/
  v1/
    resolvers/       # GraphQL resolvers (v1)
    schema/          # TypeDefs (v1)
  v2/
    resolvers/       # GraphQL resolvers (v2)
    schema/          # TypeDefs (v2)
  config/
    db.ts            # Sequelize connection
    pubsub.ts        # GraphQL PubSub
    dataLoader.ts    # DataLoader factories
    rateLimit.ts     # Rate limiter config
    logger.ts        # Winston logger
  helpers/
    auth.ts          # JWT helpers
    errors.ts        # GraphQL error helpers
    validation.ts    # Zod schemas
    loader.ts        # createLoaders helper
    webConfig.ts     # WebSocket config
  models/            # Sequelize models
  app.ts             # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MySQL

### Installation

```bash
git clone https://github.com/abhii47/express-graphql
cd express-graphql
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

### Run

```bash
# Development
npm run build
npm start
```

---

## API Endpoints

| Version | HTTP | WebSocket |
|---------|------|-----------|
| V1 | `http://localhost:4000/v1/graphql` | `ws://localhost:4000/v1/graphql` |
| V2 | `http://localhost:4000/v2/graphql` | `ws://localhost:4000/v2/graphql` |

---

## GraphQL Operations

### Queries
```graphql
# Fetch posts (cursor-based pagination)
posts(limit: Int, cursor: ID, creator_id: ID, keyword: String): PostConnection!

# Fetch single post
post(post_id: ID!): Post

# Fetch notifications (unread)
notifications: [Notification!]!
```

### Mutations
```graphql
# Auth
register(name: String!, email: String!, password: String!): User!
login(email: String!, password: String!): AuthPayload!

# Posts
createPost(title: String!, content: String!): Post!
updatePost(post_id: ID!, title: String, content: String): Post!
deletePost(post_id: ID!): Boolean!

# Comments
addComment(post_id: ID!, message: String!): Comment!
updateComment(comment_id: ID!, message: String!): Comment!
deleteComment(comment_id: ID!): Boolean!

# Likes
likePost(post_id: ID!): Like!

# Notifications
markNotificationsRead: Boolean!
```

### Subscriptions
```graphql
# New post added
subscription { postAdded { post_id title content creator { name } } }

# Comment on your post
subscription { commentAdded { comment_id message user { name } } }

# Like on your post
subscription { likeAdded { like_id user { name } post { title } } }
```

---

## V1 vs V2 Difference

| | V1 | V2 |
|--|----|----|
| Posts response | `edges` + `pageInfo` | `items` + `meta` |
| hasNextPage | `hasNextPage` | `hasMore` |
| endCursor | `endCursor` | `nextCursor` |

---

## WebSocket Authentication

Subscriptions require token in `connection_init`:

```json
{
    "type": "connection_init",
    "payload": {
        "authorization": "Bearer your_token"
    }
}
```

---

## Rate Limiting

- 200 requests per 10 minutes per IP
- Returns 429 on limit exceeded

---

## Logs

```
logs/
  error.log     # warn and error level logs
  combined.log  # all logs
```
