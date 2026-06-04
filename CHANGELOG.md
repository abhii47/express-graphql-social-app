# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0-beta] - 2026-06-04

### Added
- **GraphQL API Server** - Apollo GraphQL server setup with Express integration
- **Authentication** - JWT-based user authentication for secure access
- **User Management** - User models and resolvers for creating and fetching users
- **Posts Module** - Create, read, and manage social media posts
- **Comments System** - Nested comments functionality for engaging discussions
- **Likes Feature** - Users can like posts and comments
- **GraphQL Subscriptions** - Real-time updates for posts with user-specific authentication
- **Pagination** - Paginated posts query with likes and comments count
- **Environment Configuration** - Support for environment variables and configuration management
- **Database Integration** - MongoDB integration for persistent data storage

### Features
- User-specific GraphQL subscriptions with JWT authentication
- Paginated posts query with metadata (likes count, comments count)
- Nested comments structure for enhanced discussion threads
- Real-time post notifications via subscriptions
- Secure authentication and authorization

### Notes
This is the initial basic version of the Express-GraphQL Social App. The application includes core Instagram-like features. Future releases will include code optimization, performance improvements, and additional features.

---

## Upcoming
- Code optimization and refactoring
- Performance improvements
- Additional feature enhancements
