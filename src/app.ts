import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import sequelize, { connectDB } from "./config/db";
import http from "http";
import { getEnv } from "./config/env";
import "./models";
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from "graphql-ws/lib/use/ws";
import { limiter } from "./config/rateLimit";
import logger, { httpLogger } from "./config/logger";
import helmet from "helmet";
import { createLoaders } from "./helpers/loader";
import { wsServerConfig } from "./helpers/webConfig";
import * as v1 from "./v1";
import * as v2 from "./v2";

const app = express();
const httpServer = http.createServer(app);

export const connectedUsers = new Set<number>(); //store online users id

const versions = [
    {path:"/v1/graphql", ...v1 },
    {path:"/v2/graphql", ...v2 },
]

const servers = versions.map(({path, typeDefs, resolvers}) => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const server = new ApolloServer({ schema });
    const wsServer = new WebSocketServer({ server: httpServer, path });
    useServer(wsServerConfig(schema),wsServer);
    return { path,server };
});

const startServer = async() => {
    try {
        const port = Number(getEnv("PORT", "4000"));

        await Promise.all(servers.map(({ server }) => server.start()));
        app.use(helmet({
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: false
        }));
        servers.forEach(({ path, server }) => {
            app.use(path, 
                limiter,
                cors({ origin: "*" }),
                express.json(),
                httpLogger,
                expressMiddleware(server, {
                    context: async ({ req }) => ({
                        token: req.headers.authorization,
                        loaders: createLoaders()
                    }),
                })
            );  
            logger.info(`🚀 Server ready at http://localhost:${port}${path}`);
        });

        await connectDB();
        await sequelize.sync();
        logger.info("✅ MySQL table created successfully.");

        httpServer.listen(port, ()=>{
            versions.forEach(({ path }) => {
                logger.info(`🚀 Subscriptions ready at ws://localhost:${port}${path}`);
            });
        });
    } catch (err:any) {
        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}
startServer();