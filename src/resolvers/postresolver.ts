import Post from "../models/post";
import User from "../models/user";
import { authenticate } from "../helpers/auth";
import { accessForbiddenError, notFoundError, unauthorizedError } from "../helpers/errors";
import { Comment, Like } from "../models";

const postResolvers = {
  Query: {
    posts: async () => await Post.findAll({ include: [User] }),
    post: async (_: any, { post_id }: any) =>
      await Post.findByPk(post_id, { include: [User] }),
  },
  Mutation: {
    createPost: async (_: any, { title, content }: any, { token }: any) => {
      const decoded = authenticate({ token });
      const post = await Post.create({
        title,
        content,
        creator_id: decoded.user_id,
      });
      return post;
    },
    updatePost: async (_: any, { post_id, title, content }: any, { token }: any) => {
      const decoded = authenticate({ token });

      const post = await Post.findByPk(post_id);
      if (!post) throw notFoundError("Post not found");
      if (post.creator_id !== decoded.user_id) throw accessForbiddenError("Access Denied");

      if (title) post.title = title;
      if (content) post.content = content;
      await post.save();
      return post;
    },
    deletePost: async (_: any, { post_id }: any, { token }: any) => {
      const decoded = authenticate({token});

      const post = await Post.findByPk(post_id);
      if (!post) throw notFoundError("Post not found");
      if (post.creator_id !== decoded.user_id) throw accessForbiddenError("Access Denied");

      await post.destroy();
      return true;
    },
  },
  Post: {
    creator: async (post: any) => await User.findByPk(post.creator_id),
    comments: async (post:any) => 
      await Comment.findAll({where:{ post_id:post.post_id }}),
    likes: async(post:any) => 
      await Like.findAll({where:{ post_id:post.post_id }}),
  },
};

export default postResolvers;
