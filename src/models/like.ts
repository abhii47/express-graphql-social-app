import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/db";

class Like extends Model<
  InferAttributes<Like, { omit: "createdAt" | "updatedAt" }>,
  InferCreationAttributes<Like>
> {
  declare like_id: CreationOptional<number>;
  declare post_id: number;
  declare user_id: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Like.init(
  {
    like_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Like",
    indexes:[
      {
        unique: true,
        fields: [ "post_id", "user_id" ]
      }
    ]
  }
);

export default Like;