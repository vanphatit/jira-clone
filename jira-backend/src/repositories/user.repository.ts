import { User } from "../models/user.model";

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return User.findById(id);
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  avatar: string;
  status?: string;
}) => {
  return User.create(data);
};

export const updateUserStatus = async (
  email: string,
  status: "PENDING" | "ACTIVED" | "BANNED"
) => {
  return User.findOneAndUpdate({ email }, { status }, { new: true });
};
