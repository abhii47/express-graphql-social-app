import Like from "../models/like";
import User from "../models/user";
import Post from "../models/post";
import { authenticate } from "../helpers/auth";
import { ConflictError, internalServerError, notFoundError } from "../helpers/errors";
import pubsub from "../config/pubsub";

const likeResolvers = {
  Query: {},
  Mutation: {
    likePost: async (_: any, { post_id }: any, { token }: any) => {
      const decoded = authenticate({ token });

      const post = await Post.findByPk(post_id);
      if (!post) throw notFoundError("Post not found");

      // prevent duplicate likes
      try {
        const like = await Like.create({
          post_id,
          user_id: decoded.user_id,
        });
        // pubsub.publish("LIKE_ADDED", { likeAdded: like });
        return like;
      } catch (err:any) {
          if(err.name === "SequelizeUniqueConstraintError") throw ConflictError("You have already liked this post");
          throw internalServerError(err.message);
      }
    },
  },
  Like: {
    user: async (like: any) => await User.findByPk(like.user_id),
    post: async (like: any) => await Post.findByPk(like.post_id),
  },
};
export default likeResolvers;
