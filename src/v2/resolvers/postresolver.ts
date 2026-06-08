import { Op } from "sequelize";
import { authenticate } from "../../helpers/auth";
import { accessForbiddenError, notFoundError } from "../../helpers/errors";
import { Post } from "../../models";
import pubsub from "../../config/pubsub";
import { createPostSchema, updatePostSchema, validate } from "../../helpers/validation";

const postResolvers = {
  Query: {
    posts: async (_:any, { limit = 10, cursor, creator_id, keyword }:any) => {
      const where:any = {};
      if(creator_id) where.creator_id = creator_id;
      if(keyword) where.title = { [Op.like]: `%${keyword}%` };
      if(cursor) where.post_id = { [Op.lt]: cursor };

      const posts = await Post.findAll({
        where,
        limit:limit+1,
        order:[["post_id","DESC"]],
      });

      const hasMore = posts.length > limit;
      const items = 
          hasMore 
            ? posts.slice(0,limit) 
            : posts;

      const nextCursor = 
            items.length > 0 
              ? items[items.length-1].post_id
              : null;

      return {
        items,
        meta:{
          hasMore,
          nextCursor
        }
      };
    },
    post: async (_: any, { post_id }: any) => await Post.findByPk(post_id),
  },
  Mutation: {
    createPost: async (_: any, args: any, { token }: any) => {
      const decoded = authenticate({ token });
      const { title,content } = validate(createPostSchema, args);
      const { image_url } = args;
      const post = await Post.create({
        title,
        content,
        image_url: image_url
          ? image_url
          : null,
        creator_id: decoded.user_id,
      });
      pubsub.publish("POST_ADDED", { postAdded: post });  
      return post;
    },
    updatePost: async (_: any, args: any, { token }: any) => {
      const decoded = authenticate({ token });
      const { post_id, title, content } = validate(updatePostSchema, args);

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
    creator: async (post: any, _: any, { loaders }: any) => 
        await loaders.userLoader.load(post.creator_id),

    comments: async (post: any, _: any, { loaders }: any) => 
        await loaders.commentsLoader.load(post.post_id),

    likes: async (post: any, _: any, { loaders }: any) => 
        await loaders.likesLoader.load(post.post_id),

    commentsCount: async (post: any, _: any, { loaders }: any) => 
        await loaders.commentsCountLoader.load(post.post_id),

    likesCount: async (post: any, _: any, { loaders }: any) => 
        await loaders.likesCountLoader.load(post.post_id),
  },
};

export default postResolvers;