import Like from "../models/like";
import User from "../models/user";
import Post from "../models/post";
import { authenticate } from "../helpers/auth";
import { ConflictError, internalServerError, notFoundError } from "../helpers/errors";
import pubsub from "../config/pubsub";
import { likePostSchema, validate } from "../helpers/validation";
import { connectedUsers } from "../app";
import { Notification } from "../models";
import { NotificationType } from "../models/notification";

const likeResolvers = {
  Query: {},
  Mutation: {
    likePost: async (_: any, args: any, { token }: any) => {
      const decoded = authenticate({ token });
      const { post_id } = validate(likePostSchema, args);

      const post = await Post.findByPk(post_id);
      if (!post) throw notFoundError("Post not found");

      // prevent duplicate likes
      try {
        const like = await Like.create({
          post_id,
          user_id: decoded.user_id,
        });
        if(decoded.user_id !== post.creator_id ){
          //Online notify
          pubsub.publish(`LIKE_ADDED_USER_${post.creator_id}`, { likeAdded: like });
          //Not online then save in db
          if(!connectedUsers.has(post.creator_id)){
            const sender = await User.findByPk(decoded.user_id);
            const notificationMessage = `${sender?.name} liked your post`;
            await Notification.create({
              sender_id: decoded.user_id,
              receiver_id: post.creator_id,
              type: NotificationType.LIKE,
              message: notificationMessage,
              post_id: post.post_id,
            })
            console.log(`Notification stored for offline user: ${post.creator_id}`);
          }
        }
        return like;
      } catch (err:any) {
          if(err.name === "SequelizeUniqueConstraintError") throw ConflictError("You have already liked this post");
          throw internalServerError(err.message);
      }
    },
  },
  Like: {
   user: async (like: any, _: any, { loaders }: any) => 
        await loaders.userLoader.load(like.user_id),
    post: async (like: any) => await Post.findByPk(like.post_id),
  },
};
export default likeResolvers;
