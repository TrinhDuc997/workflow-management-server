import { Users } from "../models/index.js";
import jwt from "jsonwebtoken";

const usersController = {
  addUsers: async (req, res) => {
    try {
      const { userName = "" } = req.body || {};
      const token = jwt.sign({ userName }, process.env.JWT_KEY);
      const newUser = new Users({ ...req.body, tokens: [{ token }] });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { newProfile = {} } = req.body || {};
      const { userId, newPassword, password } = newProfile;
      const result = await Users.findOneAndUpdate(
        { _id: userId },
        {
          $set: newProfile,
          password:
            !!newPassword && newPassword !== password ? newPassword : password,
        },
        { new: true }
      );
      res.status(200).json({ newProfile: result });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.query || {};

      const deletedUser = await Users.findOneAndDelete({ _id: userId });

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found", RetCode: 0 });
      } else {
        return res
          .status(200)
          .json({ message: "success", deletedUser, RetCode: 1 });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getListUser: async (req, res) => {
    try {
      const {} = req.query || {};
      const users = await Users.find();
      const listUser = users.map((i) => {
        return {
          fullName: i.fullName,
          userName: i.userName,
          id: i._id,
          _id: i._id,
          phoneNumber: i.phoneNumber,
          address: i.address,
          password: i.password,
        };
      });
      res.status(200).json({ users: listUser });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getProfile: async (req, res) => {
    try {
      const { userName } = req.query || {};
      const user = await Users.findOne({
        userName: userName,
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  login: async function (req, res) {
    try {
      const { userName = "", password = "" } = req.body || {};
      const user = await Users.findOne({
        userName: userName,
        password: password,
      })
        .populate({
          path: "roles",
          populate: {
            path: "permissions",
            select: "name description",
          },
        })
        .exec();

      if (!!user) {
        const { tokens = [] } = user;
        const dataUser = {
          userName: user.userName || "",
          fullName: user.fullName || "",
          avatar: user.avatar || "",
          roles: user.roles || [],
        };
        res.status(200).json({ ...dataUser, token: tokens[0].token });
      } else {
        res.status(200).json({ userName, token: "", message: "LoginFalse" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default usersController;
