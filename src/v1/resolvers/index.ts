import commentResolvers from "./commentResolver";
import likeResolvers from "./likeResolver";
import notificationResolver from "./notificationResolver";
import postResolvers from "./postresolver";
import subscriptionResolver from "./subscriptionResolver";
import userResolvers from "./userResolver";

const resolvers = {
    Query:{
        ...userResolvers.Query,
        ...postResolvers.Query,
        ...commentResolvers.Query,
        ...likeResolvers.Query,
        ...notificationResolver.Query,
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation,
        ...notificationResolver.Mutation,
    },
    Post:{
        ...postResolvers.Post
    },
    Comment:{
        ...commentResolvers.Comment
    },
    Like:{
        ...likeResolvers.Like
    },
    Subscription:{
        ...subscriptionResolver.Subscription
    }
};

export default resolvers;