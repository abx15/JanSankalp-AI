"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Users,
  ArrowUpRight,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
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
}

// ─── Toast ───────────────────────────────────────────────────────────────────
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
      className={`fixed bottom-6 right-6 z-[200] px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold max-w-sm
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

// ─── Create/Edit Modal ────────────────────────────────────────────────────────
function DeptModal({
  dept,
  officers,
  onClose,
  onSave,
}: {
  dept: Department | null;
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
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8"
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
              className="h-12 rounded-xl border-2"
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
                  {o.name || o.email}
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
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center space-y-4"
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
        </p>
        {dept._count.complaints > 0 && (
          <p className="text-xs font-bold text-orange-600 bg-orange-50 rounded-xl p-3">
            ⚠ {dept._count.complaints} complaints are linked. Deletion will be
            blocked until they are reassigned.
          </p>
        )}
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
            className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white"
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
  const isAdmin = session?.user?.role === "ADMIN";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteDept, setDeleteDept] = useState<Department | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error") =>
    setToast({ msg, type });

  const fetchDepts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/departments");
    if (res.ok) setDepartments(await res.json());
    setLoading(false);
  }, []);

  const fetchOfficers = useCallback(async () => {
    const res = await fetch("/api/admin/users?role=OFFICER&limit=200");
    if (res.ok) {
      const data = await res.json();
      setOfficers(data.users ?? []);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchDepts();
    if (isAdmin) fetchOfficers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, fetchDepts, fetchOfficers, isAdmin, router]);

  const handleSave = async (
    id: string | null,
    name: string,
    headId: string,
  ) => {
    const res = await fetch(
      id ? `/api/departments/${id}` : "/api/departments",
      {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, headId: headId || null }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Operation failed", "error");
      return;
    }
    showToast(id ? "Department updated!" : "Department created!", "success");
    setShowCreate(false);
    setEditDept(null);
    fetchDepts();
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
    fetchDepts();
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.head?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">
            Departments & Triage
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Administrative structures and algorithmic assignment logic.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowCreate(true)}
            className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Initialize Department
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search active sectors..."
          className="pl-10 rounded-xl bg-card border-border/50 focus:border-primary/50 transition-all font-medium"
        />
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept, idx) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="hover:shadow-2xl hover:border-primary/20 transition-all group overflow-hidden border-t-4 border-t-primary/50 relative bg-card h-full">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Building2 className="w-24 h-24" />
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-4 w-fit">
                      <Building2 className="w-6 h-6" />
                    </div>
                    {dept._count?.complaints > 5 && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/10 animate-pulse">
                        High Load
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    {dept.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Head Officer */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-transparent group-hover:border-primary/10 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border text-muted-foreground">
                        {dept.head ? (
                          <ShieldCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <Users className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Head of Dept.
                        </p>
                        <p
                          className={`font-bold text-sm ${dept.head ? "text-foreground" : "text-orange-500"}`}
                        >
                          {dept.head?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Cases
                        </p>
                        <p className="text-2xl font-black text-blue-700">
                          {dept._count?.complaints || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">
                          Efficiency
                        </p>
                        <p className="text-2xl font-black text-green-700">
                          92%
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-2">
                      {isAdmin ? (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => setEditDept(dept)}
                            className="flex-1 justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all rounded-xl font-bold"
                          >
                            <Pencil className="w-4 h-4" /> Manage
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setDeleteDept(dept)}
                            className="w-10 h-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground transition-all rounded-xl font-bold"
                        >
                          View Sector{" "}
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4">
              <Building2 className="w-16 h-16 opacity-10" />
              <p className="font-bold">
                {search
                  ? "No sectors match your search."
                  : "No departments found."}
              </p>
              {isAdmin && !search && (
                <Button
                  onClick={() => setShowCreate(true)}
                  variant="outline"
                  className="font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create First Department
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* CRUD Modals */}
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
