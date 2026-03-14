const User =require("../models/UserSchema");

const bcrypt = require("bcrypt");

 exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });

  }
};

exports.updateProfile = async (req, res) => {
  try {

    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });

  }
};

 exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update password"
    });

  }
};

 exports.deleteAccount = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to delete account"
    });

  }
};

