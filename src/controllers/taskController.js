import moment from "moment";
import { Task, Users } from "../models/index.js";

const taskController = {
  addTask: async function (req, res, next) {
    try {
      const { listTask = [] } = req.body || {};
      console.log("🚀 ~ file: taskController.js:8 ~ listTask", listTask);
      let checkErr = false;
      let tasksSaved = [];
      await Task.insertMany(listTask)
        .then((result) => {
          tasksSaved = result;
        })
        .catch((error) => {
          checkErr = true;
        });

      const newListTask = await Promise.all(
        tasksSaved.map(async (i) => {
          const { assignedTo = "" } = i || {};
          if (!!assignedTo) {
            const dataUser = (await Users.find({ _id: assignedTo })) || [];
            return {
              ...(i._doc || {}),
              assignedTo: dataUser[0] || {},
            };
          } else {
            return i;
          }
        })
      );

      if (checkErr) {
        return res
          .status(500)
          .json({ message: "what's wrong with insert task", RetCode: 0 });
      } else {
        return res
          .status(200)
          .json({ message: "success", listTask: newListTask, RetCode: 1 });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getListTask: async (req, res) => {
    try {
      const { createDate } = req.query || {};
      const date = moment(createDate, "YYYYMMDD").startOf("day");
      let checkErr = false;

      const tasksList = await Task.find({
        createDate: createDate,
      })
        .populate("assignedTo")
        .exec();
      if (checkErr) {
        res
          .status(500)
          .json({ message: "what's wrong with insert task", RetCode: 0 });
      } else {
        res.status(200).json({ tasksList });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default taskController;
