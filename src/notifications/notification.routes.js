// notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controllers');

// Routes for CRUD operations on notifications
router.post('/', notificationController.createNotification);
router.get('/', notificationController.getAllNotifications);
router.get('/unread-count/:shopId', notificationController.getUnreadNotificationsCount);

router.post('/:id/mark-as-read', notificationController.markNotificationAsRead);
router.post('/mark-all-as-read/:shopId', notificationController.markAllNotificationsAsRead);

router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.get('/shops/:shopId', notificationController.getShopNotifications);

module.exports = router;
