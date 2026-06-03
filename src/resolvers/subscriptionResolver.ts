import pubsub from "../config/pubsub";

//listen events
const subscriptionResolver = {
    Subscription:{
        postAdded: {
            subscribe: () => pubsub.asyncIterableIterator("POST_ADDED"),
        },
        // commentAdded: {
        //     subscribe: (_:any, { post_id }:any ) => pubsub.asyncIterableIterator("COMMENT_ADDED"),
        // },
        // likeAdded: {
        //     subscribe: (_:any, { post_id }:any ) => pubsub.asyncIterableIterator("LIKE_ADDED"),
        // },
    },
};

export default subscriptionResolver;