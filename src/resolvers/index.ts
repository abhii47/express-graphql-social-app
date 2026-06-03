import commentResolvers from "./commentResolver";
import likeResolvers from "./likeResolver";
import postResolvers from "./postresolver";
import subscriptionResolver from "./subscriptionResolver";
import userResolvers from "./userResolver";

const resolvers = {
    Query:{
        ...userResolvers.Query,
        ...postResolvers.Query,
        ...commentResolvers.Query,
        ...likeResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation
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