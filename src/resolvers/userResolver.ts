import bcrypt from "bcryptjs";
import User from "../models/user";
import { authenticate, signAuthToken } from "../helpers/auth";
import { notFoundError, unauthorizedError, validationError } from "../helpers/errors";

const userResolvers = {
  Query: {
    // hello: () => "Hello world!",
    // me: async (_: any, __: any, { token }: any) => {
    //   if (!token) return null;
    //   try {
    //     const decoded = authenticate({ token });
    //     return await User.findByPk(decoded.user_id);
    //   } catch {
    //     return null;
    //   }
    // },
  },
  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw validationError("Email already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      return user;
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw notFoundError("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw unauthorizedError("Invalid password");
      const token = signAuthToken(user.user_id);
      return { token, user };
    },
  },
};

export default userResolvers;
