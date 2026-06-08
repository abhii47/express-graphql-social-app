import bcrypt from "bcryptjs";
import User from "../../models/user";
import { signAuthToken } from "../../helpers/auth";
import { ConflictError, notFoundError, unauthorizedError } from "../../helpers/errors";
import { loginSchema, registerSchema, validate } from "../../helpers/validation";

const userResolvers = {
  Query: {},
  Mutation: {
    register: async (_: any, args: any) => {
      const { name, email, password } = validate(registerSchema, args);
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw ConflictError("Email already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      return user;
    },
    login: async (_: any, args: any) => {
      const {email, password} = validate(loginSchema, args);
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
