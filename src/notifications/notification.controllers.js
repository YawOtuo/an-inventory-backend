// notificationController.js

const db = require('../../models');

// Controller for creating a new notification
exports.createNotification = async (req, res) => {
  try {
    const { subject, message, shopId } = req.body;
    const notification = await db.Notification.create({ subject, message, shopId, read: false });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for getting all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await db.Notification.findAll({
      order: [['createdAt', 'ASC']] // Order by createdAt in descending order
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller for updating a notification
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message, shopId, read } = req.body;
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.update({ subject, message, shopId, read });
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for deleting a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getShopNotifications = async (req, res) => {
    try {
      const { shopId } = req.params;
      const notifications = await db.Notification.findAll({
        where: { shopId },
        order: [['createdAt', 'DESC']] // Order by createdAt in descending order

      });
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching shop notifications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller for marking a specific notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.update({ read: true });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for marking all notifications as read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { shopId } = req.params;
    await db.Notification.update(
      { read: true },
      { where: { shopId } }
    );
    res.status(204).end();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller for getting the count of all unread notifications
exports.getUnreadNotificationsCount = async (req, res) => {
  try {
    const { shopId } = req.params;
    const count = await db.Notification.count({
      where: { shopId, read: false }
    });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
