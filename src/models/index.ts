import sequelize from "../config/db";
import User from "./user";
import Post from "./post";
import Comment from "./comment";
import Like from "./like";
import Notification from "./notification";

// User ↔ Post
User.hasMany(Post, { foreignKey: "creator_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "creator_id" });

// User ↔ Comment
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });
Post.hasMany(Comment, { foreignKey: "post_id", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

// User ↔ Like
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });
Post.hasMany(Like, { foreignKey: "post_id", as: "likes" });
Like.belongsTo(Post, { foreignKey: "post_id" });

// User ↔ Notification (receiver)
User.hasMany(Notification, { foreignKey: "receiver_id", as: "receivedNotifications" });
Notification.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

// User ↔ Notification (sender)
User.hasMany(Notification, { foreignKey: "sender_id", as: "sentNotifications" });
Notification.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

// Post ↔ Notification
Post.hasMany(Notification, { foreignKey: "post_id", as: "notifications" });
Notification.belongsTo(Post, { foreignKey: "post_id" });

export { sequelize, User, Post, Comment, Like, Notification };