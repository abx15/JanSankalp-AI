"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  FileText,
  ArrowLeft,
  Loader2,
  X,
  Check,
  AlertTriangle,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Officer {
  id: string;
  name: string | null;
  email: string;
}
interface Department {
  id: string;
  name: string;
  head: Officer | null;
  headId: string | null;
  _count: { complaints: number };
  createdAt: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className={`fixed bottom-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold max-w-sm
        ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
    >
      {type === "success" ? (
        <Check className="w-4 h-4 shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 shrink-0" />
      )}
      {msg}
      <button
        onClick={onClose}
        className="ml-auto opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function DeptModal({
  dept,
  officers,
  onClose,
  onSave,
}: {
  dept: Department | null; // null = create mode
  officers: Officer[];
  onClose: () => void;
  onSave: (id: string | null, name: string, headId: string) => Promise<void>;
}) {
  const [name, setName] = useState(dept?.name ?? "");
  const [headId, setHeadId] = useState(dept?.headId ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSave(dept?.id ?? null, name, headId);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {dept ? "Edit Department" : "New Department"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {dept
                ? "Update department details"
                : "Add a new civic department"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Department Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Public Works Department"
              className="h-12 rounded-xl border-2 focus-visible:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Head Officer (Optional)
            </label>
            <select
              value={headId}
              onChange={(e) => setHeadId(e.target.value)}
              className="w-full h-12 rounded-xl border-2 border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">— No officer assigned —</option>
              {officers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name || o.email} ({o.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : dept ? (
                "Save Changes"
              ) : (
                "Create Department"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  dept,
  onClose,
  onConfirm,
}: {
  dept: Department;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 text-center space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900">
          Delete Department?
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Are you sure you want to delete{" "}
          <span className="font-black text-slate-800">
            &ldquo;{dept.name}&rdquo;
          </span>
          ?
          {dept._count.complaints > 0 && (
            <span className="block mt-2 text-orange-600 font-bold">
              ⚠ This department has {dept._count.complaints} complaints
              assigned.
            </span>
          )}
        </p>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            disabled={loading}
            className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DepartmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteDept, setDeleteDept] = useState<Department | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error") =>
    setToast({ msg, type });

  const fetchAll = useCallback(async () => {
    const [deptRes, officerRes] = await Promise.all([
      fetch("/api/departments"),
      fetch("/api/admin/users?role=OFFICER&limit=200"),
    ]);
    if (deptRes.ok) setDepartments(await deptRes.json());
    if (officerRes.ok) {
      const data = await officerRes.json();
      setOfficers(data.users ?? data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }
    fetchAll();
  }, [session, status, router, fetchAll]);

  const handleSave = async (
    id: string | null,
    name: string,
    headId: string,
  ) => {
    const url = id ? `/api/departments/${id}` : "/api/departments";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, headId: headId || null }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Operation failed", "error");
      return;
    }
    showToast(
      id
        ? "Department updated successfully!"
        : "Department created successfully!",
      "success",
    );
    setShowCreate(false);
    setEditDept(null);
    fetchAll();
  };

  const handleDelete = async (dept: Department) => {
    const res = await fetch(`/api/departments/${dept.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Delete failed", "error");
      return;
    }
    showToast("Department deleted.", "success");
    setDeleteDept(null);
    fetchAll();
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.head?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.head?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalComplaints = departments.reduce(
    (s, d) => s + d._count.complaints,
    0,
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground">
            Loading Departments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/admin")}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              Department Management
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-0.5">
              Create, edit, and manage civic departments
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="h-12 px-6 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" />
          New Department
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Departments",
            value: departments.length,
            icon: Building2,
            color: "blue",
          },
          {
            label: "With Head Officers",
            value: departments.filter((d) => d.headId).length,
            icon: UserCog,
            color: "green",
          },
          {
            label: "Without Officers",
            value: departments.filter((d) => !d.headId).length,
            icon: Users,
            color: "orange",
          },
          {
            label: "Total Complaints",
            value: totalComplaints,
            icon: FileText,
            color: "purple",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card
            key={label}
            className="border-none shadow-sm ring-1 ring-slate-200 rounded-[2rem]"
          >
            <CardContent className="pt-5 pb-4 px-5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3
                ${color === "blue" ? "bg-blue-100" : color === "green" ? "bg-green-100" : color === "orange" ? "bg-orange-100" : "bg-purple-100"}`}
              >
                <Icon
                  className={`w-5 h-5 ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : color === "orange" ? "text-orange-600" : "text-purple-600"}`}
                />
              </div>
              <div className="text-2xl font-black text-slate-900">{value}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                {label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Table */}
      <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                All Departments
              </CardTitle>
              <CardDescription>
                {filtered.length} department{filtered.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or officer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-2"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Building2 className="w-12 h-12 opacity-20" />
              <p className="font-bold">
                {search
                  ? "No departments match your search"
                  : "No departments yet"}
              </p>
              {!search && (
                <Button
                  onClick={() => setShowCreate(true)}
                  variant="outline"
                  className="mt-2 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create First Department
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((dept, idx) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {dept.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {dept.head ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          {dept.head.name || dept.head.email}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                          No head assigned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Complaint Count */}
                  <div className="hidden md:flex flex-col items-center px-4">
                    <span className="text-xl font-black text-slate-800">
                      {dept._count.complaints}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Cases
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditDept(dept)}
                      className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteDept(dept)}
                      className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AnimatePresence>
        {(showCreate || editDept) && (
          <DeptModal
            dept={editDept}
            officers={officers}
            onClose={() => {
              setShowCreate(false);
              setEditDept(null);
            }}
            onSave={handleSave}
          />
        )}
        {deleteDept && (
          <DeleteModal
            dept={deleteDept}
            onClose={() => setDeleteDept(null)}
            onConfirm={() => handleDelete(deleteDept)}
          />
        )}
        {toast && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
