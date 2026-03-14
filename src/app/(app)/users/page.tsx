"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import type { User, Permission } from "@/lib/types";

type Role = { _id: string; name: string; permissions: string[] };

type UserFormState = {
  name: string;
  email: string;
  password?: string;
  roleIds: string[];
  permissions: string[];
  managerId?: string | null;
  status?: "active" | "suspended" | "banned";
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  roleIds: [],
  permissions: [],
  managerId: "",
};

export default function UsersPage() {
  const { push } = useToast();
  const { permissions: userPerms } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignable, setAssignable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const loadData = async () => {
    setLoading(true);
    try {
      const requests = [
        apiFetch<{ items: User[] }>("/api/users"),
        apiFetch<{ roles: Role[] }>("/api/users/roles"),
        apiFetch<{ items: Permission[] }>("/api/permissions"),
      ] as const;
      const [usersRes, rolesRes, permsRes] = await Promise.all(requests);
      let assignableRes = { permissions: [] as string[] };
      if (userPerms.includes("users.update")) {
        assignableRes = await apiFetch<{ permissions: string[] }>("/api/users/assignable");
      }
      setUsers(usersRes.items);
      setRoles(rolesRes.roles);
      setPermissions(permsRes.items);
      setAssignable(assignableRes.permissions);
    } catch (error) {
      push({ title: "Failed to load users", description: "Check API connectivity", tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      roleIds: user.roleIds,
      permissions: user.permissions,
      managerId: "",
      status: user.status,
    });
    setModalOpen(true);
  };

  const submitForm = async () => {
    try {
      if (editing) {
        if (!userPerms.includes("users.update")) throw new Error("Missing permission");
        await apiFetch(`/api/users/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            roleIds: form.roleIds,
            permissions: form.permissions,
            managerId: form.managerId || null,
            status: form.status,
          }),
        });
        push({ title: "User updated", tone: "success" });
      } else {
        if (!userPerms.includes("users.create")) throw new Error("Missing permission");
        await apiFetch(`/api/users`, {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            roleIds: form.roleIds,
            permissions: form.permissions,
            managerId: form.managerId || null,
          }),
        });
        push({ title: "User created", tone: "success" });
      }
      setModalOpen(false);
      await loadData();
    } catch (error) {
      push({ title: "Save failed", description: error instanceof Error ? error.message : "Error", tone: "error" });
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      if (!userPerms.includes("users.delete")) throw new Error("Missing permission");
      await apiFetch(`/api/users/${confirmId}`, { method: "DELETE" });
      push({ title: "User deleted", tone: "success" });
      setConfirmId(null);
      await loadData();
    } catch (error) {
      push({ title: "Delete failed", description: "Check permissions", tone: "error" });
    }
  };

  const permissionOptions = useMemo(
    () => permissions.filter((perm) => assignable.includes(perm.key)),
    [permissions, assignable]
  );

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    });
  }, [query, users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Users</h2>
          <p className="text-sm text-mist">Manage access, roles, assignments, and status.</p>
        </div>
        {userPerms.includes("users.create") && <Button onClick={openCreate}>New User</Button>}
      </div>

      {loading && <LoadingState label="Loading users..." />}
      {!loading && filteredUsers.length === 0 && (
        <EmptyState title="No users yet" description="Create your first team member to get started." />
      )}
      {!loading && filteredUsers.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td className="text-mist">{user.email}</td>
                  <td>
                    <span className="badge">{user.status}</span>
                  </td>
                  <td className="flex flex-wrap gap-2">
                    {userPerms.includes("users.update") && (
                      <Button variant="secondary" onClick={() => openEdit(user)}>
                        Edit
                      </Button>
                    )}
                    {userPerms.includes("users.delete") && (
                      <Button variant="ghost" onClick={() => setConfirmId(user.id)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Edit User" : "Create User"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {!editing && (
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <div>
            <p className="text-xs text-mist">Role assignment</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {roles.map((role) => (
                <label key={role._id} className="flex items-center gap-2 text-sm text-mist">
                  <input
                    type="checkbox"
                    checked={form.roleIds.includes(role._id)}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        roleIds: e.target.checked
                          ? [...prev.roleIds, role._id]
                          : prev.roleIds.filter((id) => id !== role._id),
                      }));
                    }}
                  />
                  {role.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-mist">Extra permissions</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {permissionOptions.map((perm) => (
                <label key={perm.key} className="flex items-center gap-2 text-xs text-mist">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(perm.key)}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        permissions: e.target.checked
                          ? [...prev.permissions, perm.key]
                          : prev.permissions.filter((id) => id !== perm.key),
                      }));
                    }}
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          </div>
          {editing && (
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </Select>
          )}
          <Input
            placeholder="Manager ID (optional)"
            value={form.managerId ?? ""}
            onChange={(e) => setForm({ ...form, managerId: e.target.value })}
          />
          <p className="text-xs text-mist">Manager ID must be a 24-character MongoDB ObjectId.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitForm}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Delete user"
        description="This action is permanent. Are you sure you want to delete the user?"
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
