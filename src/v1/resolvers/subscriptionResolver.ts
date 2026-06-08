import pubsub from "../../config/pubsub";

//listen events
const subscriptionResolver = {
    Subscription:{
        postAdded: {
            subscribe: () => pubsub.asyncIterableIterator("POST_ADDED"),
        },
        commentAdded: {
            subscribe: (_:any, __:any, context:any) => pubsub.asyncIterableIterator(`COMMENT_ADDED_USER_${context.user_id}`),
        },
        likeAdded: {
            subscribe: (_:any, __:any, context:any) => pubsub.asyncIterableIterator(`LIKE_ADDED_USER_${context.user_id}`),
        },
    },
};

export default subscriptionResolver;