import { 
    createUserLoader, 
    createCommentsLoader, 
    createLikesLoader,
    createCommentsCountLoader,
    createLikesCountLoader
} from "../config/dataLoader";

export const createLoaders = () => ({
    userLoader: createUserLoader(),
    commentsLoader: createCommentsLoader(),
    likesLoader: createLikesLoader(),
    commentsCountLoader: createCommentsCountLoader(),
    likesCountLoader: createLikesCountLoader(),
});

