import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import { redisClient } from '../config/redis.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user already exists
  const emailExists = await redisClient.sIsMember('emails', email);
  if (!emailExists) {
    res.status(401);
    throw new Error('User not exists');
  }

  const user = await User.findOne({ email });

  // check if user exists and password is correct
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

  
  // @desc    Register a new user
  // @route   POST /api/users
  // @access  Public
  const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
  
    // check if user already exists
    const emailExists = await redisClient.sIsMember('emails', email);
    if (emailExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });
  
    if (user) {
      // add email to Redis set
      await redisClient.sAdd('emails', email);
  
      generateToken(res, user._id);
      // serialize user object and store it in Redis
      const serializedUser = serialize(user.toObject());
      await redisClient.hSet(`user:${user._id}`, serializedUser);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        password: user.password,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });
  

  // @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };
  
  // @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cachedUser = await redisClient.hGetAll(`user:${userId}`);
  let user;

  if (cachedUser && Object.keys(cachedUser).length !== 0) {
    user = deserialize(cachedUser);
  } else {
    user = await User.findById(userId);
  }
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

  
  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      const { password, ...userDataWithoutPassword } = updatedUser.toObject();
      const serializedUser = serialize(userDataWithoutPassword);
      await redisClient.hSet(`user:${updatedUser._id}`, serializedUser);
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  
  // @desc    Get all users
  // @route   GET /api/users
  // @access  Private/Admin
  const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  });
  
  // @desc    Delete user
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
  
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error('Can not delete admin user');
      }
  
      await User.deleteOne({ _id: userId });
  
      await redisClient.del(`user:${userId}`);
  
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  
  
  // @desc    Get user by ID
  // @route   GET /api/users/:id
  // @access  Private/Admin
  const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    const cachedUser = await redisClient.hGetAll(`user:${userId}`);
    let user;
  
    if (cachedUser && Object.keys(cachedUser).length !== 0) {
      user = deserialize(cachedUser);
    } else {
      user = await User.findById(userId).select('-password');
    }
  
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  
  // @desc    Update user
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
  
      const updatedUser = await user.save();
  
      const serializedUser = serialize(updatedUser.toObject());
      await redisClient.hSet(`user:${updatedUser._id}`, serializedUser);
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  
  
  export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
  };
