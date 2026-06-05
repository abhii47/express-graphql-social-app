import { z } from "zod";
import { validationError } from "./errors";


export const registerSchema = z.object({
    name: z.string()
        .nonempty("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters")
        .trim(),
    email: z.email("Invalid email"),
    password: z.string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password too long"),
});

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long"),
});

export const createPostSchema = z.object({
    title: z.string()
        .min(1, "Title required")
        .max(100, "Title too long"),
    content: z.string()
        .min(1, "Content required"),
});

export const updatePostSchema = z.object({
    post_id: z.coerce.number()
        .min(1, "Post ID required"),
    title: z.string()
        .min(1, "Title required")
        .max(100, "Title too long")
        .optional(),
    content: z.string()
        .min(1, "Content required")
        .optional(),
});

export const addCommentSchema = z.object({
    post_id: z.coerce.number()
        .min(1, "Post ID required"),
    message: z.string()
        .min(1, "Message required")
        .max(500, "Message too long"),
});

export const updateCommentSchema = z.object({
    comment_id: z.coerce.number()
        .min(1, "Comment ID required"),
    message: z.string()
        .min(1, "Message required")
        .max(500, "Message too long"),
});

export const likePostSchema = z.object({
    post_id: z.coerce.number()
        .min(1, "Post ID required"),
});

export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
        const message = result.error.issues[0].message;
        throw validationError(message);
    }
    return result.data;
};

