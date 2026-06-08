import { Sequelize } from "sequelize";
import { getEnv } from "./env";
import logger from "./logger";

const sequelize = new Sequelize(getEnv("DB_NAME"), getEnv("DB_USER"), getEnv("DB_PASSWORD"), {
  host: getEnv("DB_HOST", "localhost"),
  dialect: "mysql",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ MySQL connection established successfully.");
  } catch (error) {
    logger.error("❌ Unable to connect to the database:", error);
  }
};

export default sequelize;
