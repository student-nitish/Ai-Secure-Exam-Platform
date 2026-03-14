 const Notification= require("../models/notification");

 exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};



 exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({
    success: true,
  });
};