import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schemaUsers = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  fullName: {
    type: String,
  },
  address: {
    type: String,
  },
  avatar: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
});

export const Users = mongoose.model("Users", schemaUsers);

// Định nghĩa schema cho bảng Task
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String, // tên người dùng
      required: true,
    },
    text: {
      type: String, // nội dung bình luận
      required: true,
    },
  },
  { timestamps: true }
);
const materialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
  },
});
const TaskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    unitPrice: {
      type: Number,
    },
    createDate: {
      type: String,
    },
    comments: [commentSchema],
    materials: [materialSchema],
  },
  {
    timestamps: true,
  }
);

// Tạo model cho bảng Task
export const Task = mongoose.model("Task", TaskSchema);

// Định nghĩa schema cho bảng Roles
const RoleSchema = new Schema({
  name: String,
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

// Tạo model cho bảng Roles
const Role = mongoose.model("Role", RoleSchema);

const PermissionSchema = new Schema({
  name: String,
  description: String,
});

const Permission = mongoose.model("Permission", PermissionSchema);
