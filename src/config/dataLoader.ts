import DataLoader from "dataloader";
import { User, Comment, Like } from "../models";
import { Op } from "sequelize";

// User loader
export const createUserLoader = () => new DataLoader(async (userIds: readonly number[]) => {
    const users = await User.findAll({
        where: { user_id: { [Op.in]: [...userIds] } }
    });
    // har id ke liye user return karo same order mein
    return userIds.map(id => users.find(u => u.user_id === id) || null);
});

// Comments loader (post_id se)
export const createCommentsLoader = () => new DataLoader(async (postIds: readonly number[]) => {
    const comments = await Comment.findAll({
        where: { post_id: { [Op.in]: [...postIds] } }
    });
    return postIds.map(id => comments.filter(c => c.post_id === id));
});

// Likes loader (post_id se)
export const createLikesLoader = () => new DataLoader(async (postIds: readonly number[]) => {
    const likes = await Like.findAll({
        where: { post_id: { [Op.in]: [...postIds] } }
    });
    return postIds.map(id => likes.filter(l => l.post_id === id));
});

// CommentsCount loader
export const createCommentsCountLoader = () => new DataLoader(async (postIds: readonly number[]) => {
    const comments = await Comment.findAll({
        where: { post_id: { [Op.in]: [...postIds] } }
    });
    return postIds.map(id => comments.filter(c => c.post_id === id).length);
});

// LikesCount loader
export const createLikesCountLoader = () => new DataLoader(async (postIds: readonly number[]) => {
    const likes = await Like.findAll({
        where: { post_id: { [Op.in]: [...postIds] } }
    });
    return postIds.map(id => likes.filter(l => l.post_id === id).length);
});
