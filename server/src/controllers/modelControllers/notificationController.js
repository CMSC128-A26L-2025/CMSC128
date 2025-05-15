import Notification from '../../models/Notification.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const notificationController = createCRUDController(Notification);

export const getMyUnread = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifs = await Notification
      .find({ user: userId, status: 'unread' })
      .sort('-createdAt')
      .populate('announcement');
    return res.json(notifs);
  } catch (err) {
    return next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification
      .findByIdAndUpdate(id, { status: 'read' }, { new: true });
    return res.json(notif);
  } catch (err) {
    return next(err);
  }
};
