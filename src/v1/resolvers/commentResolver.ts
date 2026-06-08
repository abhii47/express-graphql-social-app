import Comment from "../../models/comment";
import Post from "../../models/post";
import { authenticate } from "../../helpers/auth";
import { accessForbiddenError, notFoundError, unauthorizedError } from "../../helpers/errors";
import pubsub from "../../config/pubsub";
import { addCommentSchema, updateCommentSchema, validate } from "../../helpers/validation";

const commentResolvers = {
  Query: {},
  Mutation: {
    addComment: async (_: any, args: any, { token }: any) => {
      const decoded = authenticate({ token });
      const { post_id, message } = validate(addCommentSchema, args);

      const post = await Post.findByPk(post_id);
      if (!post) throw notFoundError("Post not found");

      const comment = await Comment.create({
        message,
        post_id,
        user_id: decoded.user_id,
      });
      pubsub.publish(`COMMENT_ADDED_USER_${post.creator_id}`, { commentAdded: comment });
      return comment;
    },
    updateComment: async (_: any, args: any, { token }: any) => {
      const decoded = authenticate({token});
      const {comment_id, message} = validate(updateCommentSchema, args);

      const comment = await Comment.findByPk(comment_id);
      if (!comment) throw notFoundError("Comment not found");
      if (comment.user_id !== decoded.user_id) throw accessForbiddenError("Access Denied");

      comment.message = message;
      await comment.save();
      return comment;
    },
    deleteComment: async (_: any, { comment_id }: any, { token }: any) => {
      const decoded = authenticate({token});

      const comment = await Comment.findByPk(comment_id);
      if (!comment) throw notFoundError("Comment not found");
      if (comment.user_id !== decoded.user_id) throw accessForbiddenError("Access Denied");

      await comment.destroy();
      return true;
    },
  },
  Comment: {
    user: async (comment: any, _: any, { loaders }: any) => 
        await loaders.userLoader.load(comment.user_id),
    post: async (comment: any) => await Post.findByPk(comment.post_id),
  },
};
export default commentResolvers;
