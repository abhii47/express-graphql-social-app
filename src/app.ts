import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import sequelize, { connectDB } from "./config/db";
import typeDefs from "./schema/typeDefs";
import resolvers from "./resolvers";
import "./models";

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async() => {
    try {
        await server.start();
        app.use('/graphql',
            cors(),
            express.json(),
            expressMiddleware(server, {
                context: async ({ req }) => ({
                    token: req.headers.authorization
                }),
            })
        );
        await connectDB();
        await sequelize.sync();
        console.log("✅ MySQL table created successfully.");
        app.listen(4000, ()=>{
            console.log("🚀 Server ready at http://localhost:4000/graphql");
        });
    } catch (err:any) {
        console.log(err);
        process.exit(1);
    }
}
startServer();