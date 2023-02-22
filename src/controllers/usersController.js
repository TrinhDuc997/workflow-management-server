import { Users } from "../models/index.js";
import jwt from "jsonwebtoken";

const usersController = {
  addUsers: async (req, res) => {
    try {
      const { userName = "", password = "" } = req.body || {};
      const token = jwt.sign({ userName }, process.env.JWT_KEY);
      const newUser = new Users({ ...req.body, tokens: [{ token }] });
      await newUser.save((err) => {
        if (err) {
          console.log(err.message);
        }
      });
      res.status(200).json({ userName, token });
    } catch (error) {
      res.status(500).json(error);
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
        };
      });
      res.status(200).json({ users: listUser });
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
      });

      if (!!user) {
        const { tokens = [] } = user;
        const dataUser = {
          userName: user.userName || "",
          fullName: user.fullName || "",
          avatar: user.avatar || "",
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
