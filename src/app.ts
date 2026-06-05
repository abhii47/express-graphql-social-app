import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import sequelize, { connectDB } from "./config/db";
import http from "http";
import { getEnv } from "./config/env";
import typeDefs from "./schema/typeDefs";
import resolvers from "./resolvers";
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
} from "./config/dataLoader"
// import { Notify } from "./helpers/notify";

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
export const connectedUsers = new Set<number>();
useServer({ 
    schema,
    onConnect: async(ctx) => {
        const token = ctx.connectionParams?.authorization as string;
        console.log("token",token);
        if (!token) {
            throw unauthorizedError("Unauthorized: Token required");
        }
        try {
            const decoded = authenticate({ token });
            (ctx.extra as any).user = decoded;
            connectedUsers.add(decoded.user_id);
            // console.log(`inside set =>>`, connectedUsers);
            console.log("Client connected:", decoded.user_id);
            // const notification = await Notify(decoded.user_id);
            // const messages = notification.map(n => n.message);
            // console.log("messages",messages);
            return { user_id: decoded.user_id };
        } catch (err) {
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
        // console.log(`inside set =>>`, connectedUsers);
        console.log("Client disconnected", user.user_id);
    }
}, wsServer);


const server = new ApolloServer({
    schema
});

const startServer = async() => {
    try {
        const port = Number(getEnv("PORT", "4000"));

        await server.start();
        app.use('/graphql',
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
        console.log("✅ MySQL table created successfully.");
        httpServer.listen(port, ()=>{
            console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
            console.log(`🚀 Subscriptions ready at ws://localhost:${port}/graphql`);
        });
    } catch (err:any) {
        console.log(err);
        process.exit(1);
    }
}
startServer();
