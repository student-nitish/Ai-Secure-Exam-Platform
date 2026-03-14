const bcrypt = require("bcrypt");
const User = require("../models/UserSchema")
const jwt = require("jsonwebtoken");


  exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const image = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      image,
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};


// LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered. Please signup first.",
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    user.password = undefined;

    const options = {
      httpOnly: true,
       maxAge: 3 * 24 * 60 * 60 * 1000,
      
      secure: process.env.NODE_ENV === "production",
    };

   
    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "Login successful",
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Try again.",
    });
  }
};

// logout controller
 exports. logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,       
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};



