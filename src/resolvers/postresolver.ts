import Post from "../models/post";
import User from "../models/user";
import jwt from "jsonwebtoken";

const SECRET = "supersecretkey";

const postResolvers = {
  Query: {
    posts: async () => await Post.findAll({ include: [User] }),
    post: async (_: any, { post_id }: any) =>
      await Post.findByPk(post_id, { include: [User] }),
  },
  Mutation: {
    createPost: async (_: any, { title, content }: any, { token }: any) => {
      if (!token) throw new Error("Not authenticated");

      const decoded: any = jwt.verify(token.replace("Bearer ", ""), SECRET);
      const post = await Post.create({
        title,
        content,
        creator_id: decoded.user_id,
      });
      return post;
    },
  },
  Post: {
    creator: async (post: any) => {
        const creator = await User.findByPk(post.creator_id)
        return creator;
    }
  },
};

export default postResolvers;