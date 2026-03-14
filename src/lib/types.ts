export type User = {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  status: "active" | "suspended" | "banned";
  permissions: string[];
};

export type Permission = {
  key: string;
  label: string;
  module: string;
  description?: string;
};

export type Task = {
  _id: string;
  title: string;
  status: "open" | "in_progress" | "done" | "blocked";
  assigneeId?: string | null;
  dueDate?: string | null;
  priority: "low" | "medium" | "high";
  createdAt?: string;
  updatedAt?: string;
};
