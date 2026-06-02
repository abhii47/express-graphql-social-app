import Like from "../models/like";
import User from "../models/user";
import Post from "../models/post";
import { authenticate } from "../helpers/auth";
import { notFoundError } from "../helpers/errors";

const likeResolvers = {
  Query: {
    // likes: async (_: any, { post_id }: any) =>
    //   await Like.findAll({ where: { post_id }, include: [User, Post] }),
  },
  Mutation: {
    likePost: async (_: any, { post_id }: any, { token }: any) => {
      const decoded = authenticate({ token });

      const post = await Post.findByPk(post_id);
      if (!post) throw notFoundError("Post not found");

      // prevent duplicate likes
      const existing = await Like.findOne({
        where: { post_id, user_id: decoded.user_id },
      });
      if (existing) return existing;

      const like = await Like.create({
        post_id,
        user_id: decoded.user_id,
      });
      return like;
    },
  },
  Like: {
    user: async (like: any) => await User.findByPk(like.user_id),
    post: async (like: any) => await Post.findByPk(like.post_id),
  },
};
export default likeResolvers;
