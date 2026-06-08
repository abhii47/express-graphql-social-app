import commentResolvers from "../../v1/resolvers/commentResolver";
import likeResolvers from "../../v1/resolvers/likeResolver";
import notificationResolver from "../../v1/resolvers/notificationResolver";
import postResolvers from "../../v2/resolvers/postresolver";
import subscriptionResolver from "../../v1/resolvers/subscriptionResolver";
import userResolvers from "../../v1/resolvers/userResolver";

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