import { Op } from "sequelize";
import { authenticate } from "../helpers/auth";
import { accessForbiddenError, notFoundError } from "../helpers/errors";
import { User, Post, Comment, Like } from "../models";
import pubsub from "../config/pubsub";

const postResolvers = {
  Query: {
    posts: async (_:any, { limit = 10, offset = 0, creator_id, keyword }:any) => {
      const where:any = {};
      if(creator_id) where.creator_id = creator_id;
      if(keyword) where.title = { [Op.like]: `%${keyword}%` };

      const posts = await Post.findAll({
        where,
        limit,
        offset,
        order:[["createdAt","DESC"]],
      });

      return posts;
    },
    post: async (_: any, { post_id }: any) => await Post.findByPk(post_id),
  },
  Mutation: {
    createPost: async (_: any, { title, content }: any, { token }: any) => {
      const decoded = authenticate({ token });
      const post = await Post.create({
        title,
        content,
        creator_id: decoded.user_id,
      });
      pubsub.publish("POST_ADDED", { postAdded: post });  
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
    commentsCount: async(post:any) => 
      await Comment.count({ where:{ post_id:post.post_id }}),
    likesCount: async(post:any) =>
      await Like.count({ where:{ post_id:post.post_id }})
  },
};

export default postResolvers;