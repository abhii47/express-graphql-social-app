import { Sequelize } from "sequelize";

const sequelize = new Sequelize("insta_clone_db", "root", "mysql@abhi", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

export default sequelize;