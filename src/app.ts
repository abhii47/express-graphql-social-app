import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import sequelize, { connectDB } from "./config/db";
import http from "http";
import { getEnv } from "./config/env";
import typeDefs from "./v1/schema/typeDefs";
import resolvers from "./v1/resolvers";
import "./models";
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from "graphql-ws/lib/use/ws";
import { authenticate } from "./helpers/auth";
import { unauthorizedError } from "./helpers/errors";
import { 
    createUserLoader, 
    createCommentsLoader, 
    createLikesLoader,
    createCommentsCountLoader,
    createLikesCountLoader
} from "./config/dataLoader";
import { limiter } from "./config/rateLimit";
import logger from "./config/logger";
import helmet, { contentSecurityPolicy, crossOriginEmbedderPolicy, crossOriginResourcePolicy } from "helmet";

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/v1/graphql",
});
export const connectedUsers = new Set<number>(); //store online users id
useServer({ 
    schema,
    onConnect: async(ctx) => {
        const token = ctx.connectionParams?.authorization as string;
        console.log("token",token);
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
    context: (ctx) => {
        const token = ctx.connectionParams?.authorization as string;
        const decoded = authenticate({ token });
        return { 
            user_id: decoded.user_id,
            loaders: {
                userLoader: createUserLoader(),
                commentsLoader: createCommentsLoader(),
                likesLoader: createLikesLoader(),
                commentsCountLoader: createCommentsCountLoader(),
                likesCountLoader: createLikesCountLoader(),
            }
        };
    },
    onDisconnect: (ctx) => {
        const user = (ctx.extra as any).user;
        connectedUsers.delete(user.user_id);
        logger.info(`User ${user.user_id} disconnected`)
    }
}, wsServer);


const server = new ApolloServer({
    schema
});

const startServer = async() => {
    try {
        const port = Number(getEnv("PORT", "4000"));

        await server.start();
        app.use(helmet({
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: false
        }));
        app.use('/v1/graphql', 
            limiter,
            cors({ origin: "*" }),
            express.json(),
            expressMiddleware(server, {
                context: async ({ req }) => ({
                    token: req.headers.authorization,
                    loaders: {
                        userLoader: createUserLoader(),
                        commentsLoader: createCommentsLoader(),
                        likesLoader: createLikesLoader(),
                        commentsCountLoader: createCommentsCountLoader(),
                        likesCountLoader: createLikesCountLoader(),
                    }
                }),
            })
        );
        await connectDB();
        await sequelize.sync();
        logger.info("✅ MySQL table created successfully.");
        httpServer.listen(port, ()=>{
            logger.info(`🚀 Server ready at http://localhost:${port}/v1/graphql`);
            logger.info(`🚀 Subscriptions ready at ws://localhost:${port}/v1/graphql`);
        });
    } catch (err:any) {
        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}
startServer();
