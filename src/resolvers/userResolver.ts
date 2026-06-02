import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

const SECRET = "supersecretkey"; 

const userResolvers = {
  Query: {
    hello: () => "Hello world!",
    me: async (_: any, __: any, { token }: any) => {
      if (!token) return null;
      try {
        const decoded: any = jwt.verify(token.replace("Bearer ", ""), SECRET);
        return await User.findByPk(decoded.user_id);
      } catch {
        return null;
      }
    },
  },
  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      return user;
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      const token = jwt.sign({ user_id: user.user_id }, SECRET, {
        expiresIn: "1h",
      });
      return { token, user };
    },
  },
};

export default userResolvers;