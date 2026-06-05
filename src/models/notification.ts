import { 
    CreationOptional,
    DataTypes,
    InferAttributes, 
    InferCreationAttributes, 
    Model 
} from "sequelize";
import sequelize from "../config/db";

export enum NotificationType {
    LIKE = "like",
    COMMENT = "comment",
}

class Notification extends Model<
    InferAttributes<Notification, { omit: 'createdAt'}>, 
    InferCreationAttributes<Notification>
> {
    declare notification_id: CreationOptional<number>;
    declare receiver_id: number;
    declare sender_id: number;
    declare type: string;
    declare message: string;
    declare is_read: CreationOptional<boolean>;
    declare post_id: number;

    declare createdAt: CreationOptional<Date>; 
}

Notification.init({
    notification_id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    receiver_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    sender_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    type: {
        type:DataTypes.ENUM(NotificationType.LIKE, NotificationType.COMMENT),
        allowNull:false,
    },
    message: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    is_read: {
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    post_id: {
        type:DataTypes.INTEGER,
        allowNull:true,
    }
},{
    sequelize,
    modelName:"Notification",
});

export default Notification;