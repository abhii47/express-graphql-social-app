import { authenticate } from "../../helpers/auth";
import { Notification } from "../../models";

const notificationResolver = {
    
    Query: {
        notifications: async (_:any, __:any, context:any) => {
            const decoded = authenticate(context);
            return await Notification.findAll({
                where: {
                    receiver_id: decoded.user_id,
                    is_read: false
                },
                order:[["createdAt","DESC"]]
            });
        },
    },
    Mutation: {
        markNotificationAsRead: async (_:any, __:any, context:any) => {
            const decoded = authenticate(context);
            await Notification.update({
                is_read: true
            }, {
                where: {
                    receiver_id: decoded.user_id,
                    is_read: false
                }
            });
            return true;
        },
    },
    
}

export default notificationResolver;
