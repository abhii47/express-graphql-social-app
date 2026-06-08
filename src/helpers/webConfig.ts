import { connectedUsers } from "../app";
import logger from "../config/logger";
import { authenticate } from "./auth";
import { unauthorizedError } from "./errors";
import { createLoaders } from "./loader";

export const wsServerConfig = (schemaToUse: any) => ({
    schema: schemaToUse,
    onConnect: async(ctx: any) => {
        const token = ctx.connectionParams?.authorization as string;
        logger.info(`Token received for subscription`);
        if (!token) {
            logger.warn("Token required for subscription");
            throw unauthorizedError("Unauthorized: Token required");
        }
        try {
            const decoded = authenticate({ token });
            (ctx.extra as any).user = decoded;
            connectedUsers.add(decoded.user_id);
            logger.info(`User ${decoded.user_id} connected`);
            return { user_id: decoded.user_id };
        } catch (err) {
            logger.warn("Invalid token attempt");
            throw unauthorizedError("Unauthorized: Invalid token");
        }
    },
    context: (ctx: any) => {
        const token = ctx.connectionParams?.authorization as string;
        const decoded = authenticate({ token });
        return { 
            user_id: decoded.user_id,
            loaders: createLoaders()
        };
    },
    onDisconnect: (ctx: any) => {
        const user = (ctx.extra as any).user;
        connectedUsers.delete(user.user_id);
        logger.info(`User ${user.user_id} disconnected`);
    }
})