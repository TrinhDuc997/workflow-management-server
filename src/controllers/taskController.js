import moment from "moment";
import { Task, Users } from "../models/index.js";

const taskController = {
  addTask: async function (req, res, next) {
    try {
      const { listTask = [] } = req.body || {};
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
  editTask: async function (req, res, next) {
    try {
      const { taskId, taskData } = req.body || {};

      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { $set: taskData },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found", RetCode: 0 });
      } else {
        const { assignedTo = "" } = updatedTask || {};
        let dataUser = {};
        if (!!assignedTo) {
          dataUser = await Users.findById(assignedTo);
        }

        return res.status(200).json({
          message: "success",
          task: {
            ...((updatedTask || {})._doc || {}),
            assignedTo: {
              _id: (dataUser || {})._id,
              fullName: (dataUser || {}).fullName,
              userName: (dataUser || {}).userName,
            },
          },
          RetCode: 1,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deleteTask: async function (req, res, next) {
    try {
      const { taskId } = req.body || {};

      const deletedTask = await Task.findOneAndDelete({ _id: taskId });

      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found", RetCode: 0 });
      } else {
        return res
          .status(200)
          .json({ message: "success", deletedTask, RetCode: 1 });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getListTask: async (req, res) => {
    try {
      const { createDate } = req.query || {};
      // const date = moment(createDate, "YYYYMMDD").startOf("day");
      let checkErr = false;
      const tasksList = await Task.find({
        createDate: createDate,
      })
        .populate("assignedTo", "_id userName fullName")
        .exec();

      const modifiedList = tasksList.map((task) => ({
        ...task.toObject(),
        assignedTo: {
          _id: task.assignedTo?._id,
          userName: task.assignedTo?.userName,
          fullName: task.assignedTo?.fullName,
        },
      }));
      if (checkErr) {
        res
          .status(500)
          .json({ message: "what's wrong with insert task", RetCode: 0 });
      } else {
        res.status(200).json({ tasksList: modifiedList });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getListTaskAccordingMonth: async (req, res) => {
    try {
      const { monthSelected } = req.query || {};
      // const date = moment(createDate, "YYYYMMDD").startOf("day");
      let checkErr = false;
      const tasksList = await Task.find({
        createDate: {
          $gte: monthSelected + "01",
          $lte: monthSelected + "31",
        },
      })
        .populate("assignedTo", "_id userName fullName")
        .exec();

      const modifiedList = tasksList.map((task) => ({
        ...task.toObject(),
        assignedTo: {
          id: task.assignedTo?._id,
          userName: task.assignedTo?.userName,
          fullName: task.assignedTo?.fullName,
        },
      }));

      const formatListTasksAccrodingDay = {};
      modifiedList.forEach((i) => {
        const { createDate } = i || {};
        if (!formatListTasksAccrodingDay[createDate]) {
          formatListTasksAccrodingDay[createDate] = [{ ...i }];
        } else {
          formatListTasksAccrodingDay[createDate].push(i);
        }
      });

      if (checkErr) {
        res
          .status(500)
          .json({ message: "what's wrong with insert task", RetCode: 0 });
      } else {
        res
          .status(200)
          .json({ tasksListAccrodingDay: formatListTasksAccrodingDay });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default taskController;
