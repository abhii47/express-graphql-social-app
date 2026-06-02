import postResolvers from "./postresolver";
import userResolvers from "./userResolver";

const resolvers = {
    Query:{
        ...userResolvers.Query,
        ...postResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation
    },
    Post:{
        ...postResolvers.Post
    }
};

export default resolvers;