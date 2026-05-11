import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Anchor, Plus, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useListShDevTasks, useCreateShDevTask, useUpdateShDevTask } from "@workspace/api-client-react";
import { useSeo } from "@/hooks/use-seo";
import type { ShDevTask } from "@workspace/api-client-react";

const STATUS_ORDER = ["in-progress", "planned", "backlog", "done"];

const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  planned: "Planned",
  "in-progress": "In Progress",
  done: "Done",
};

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-muted text-muted-foreground",
  planned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
  critical: "bg-red-600 text-white",
};

function TaskCard({ task, onUpdate }: { task: ShDevTask; onUpdate: () => void }) {
  const { toast } = useToast();
  const updateTask = useUpdateShDevTask();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    architectureNotes: task.architectureNotes,
    status: task.status,
    priority: task.priority,
  });

  const handleSave = () => {
    updateTask.mutate(
      { id: task.id, data: editData },
      {
        onSuccess: () => {
          toast({ title: "Task updated" });
          setEditing(false);
          onUpdate();
        },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      }
    );
  };

  const handleStatusChange = (status: string) => {
    updateTask.mutate(
      { id: task.id, data: { status } },
      {
        onSuccess: onUpdate,
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      }
    );
  };

  if (editing) {
    return (
      <div className="bg-card border border-primary/40 rounded-xl p-5 space-y-3">
        <Input
          value={editData.title}
          onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
          className="font-semibold"
          placeholder="Task title"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <Select value={editData.status} onValueChange={v => setEditData(d => ({ ...d, status: v }))}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
            <Select value={editData.priority} onValueChange={v => setEditData(d => ({ ...d, priority: v }))}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Description</label>
          <Textarea
            value={editData.description}
            onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
            rows={3}
            placeholder="What does this feature do?"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Architecture Notes</label>
          <Textarea
            value={editData.architectureNotes}
            onChange={e => setEditData(d => ({ ...d, architectureNotes: e.target.value }))}
            rows={4}
            placeholder="Technical design, dependencies, implementation notes..."
            className="font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={updateTask.isPending}>
            <Check className="h-3.5 w-3.5 mr-1" /> Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-snug mb-2">{task.title}</div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] ?? "bg-muted text-muted-foreground"}`}>
                {STATUS_LABELS[task.status] ?? task.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] ?? "bg-muted text-muted-foreground"}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-7 w-32 text-xs border-dashed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v} className="text-xs">{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
        )}
      </div>

      {expanded && task.architectureNotes && (
        <div className="border-t border-border px-5 py-4 bg-muted/30">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Architecture Notes</div>
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">{task.architectureNotes}</pre>
        </div>
      )}
    </div>
  );
}

function AddTaskForm({ onAdded }: { onAdded: () => void }) {
  const { toast } = useToast();
  const createTask = useCreateShDevTask();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    architectureNotes: "",
    status: "backlog",
    priority: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    createTask.mutate(form, {
      onSuccess: () => {
        toast({ title: "Task added to roadmap" });
        setForm({ title: "", description: "", architectureNotes: "", status: "backlog", priority: "medium" });
        setOpen(false);
        onAdded();
      },
      onError: () => toast({ title: "Failed to add task", variant: "destructive" }),
    });
  };

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Task to Roadmap
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="font-semibold text-sm mb-1">New Roadmap Task</div>
      <Input
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Feature title (e.g. Guest Liability Waiver System)"
        required
        autoFocus
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Status</label>
          <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
          <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
        <Textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={2}
          placeholder="What does this feature do?"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Architecture Notes</label>
        <Textarea
          value={form.architectureNotes}
          onChange={e => setForm(f => ({ ...f, architectureNotes: e.target.value }))}
          rows={3}
          placeholder="Technical design, dependencies, implementation notes..."
          className="font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={createTask.isPending || !form.title.trim()}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminRoadmap() {
  useSeo({ title: "Admin Roadmap — Hatteras Community Sailing", description: "Admin roadmap.", noIndex: true });
  const { data: tasks, isLoading, refetch } = useListShDevTasks();

  const grouped = STATUS_ORDER.reduce<Record<string, ShDevTask[]>>((acc, status) => {
    acc[status] = (tasks ?? []).filter(t => t.status === status);
    return acc;
  }, {});

  const total = (tasks ?? []).length;
  const done = (tasks ?? []).filter(t => t.status === "done").length;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <Anchor className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">Hatteras Community Sailing — Staff Portal</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-3xl font-bold">Dev Roadmap</h1>
            {total > 0 && (
              <div className="text-sm text-muted-foreground">
                {done}/{total} complete
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Feature backlog, architecture notes, and development priorities for SailHatteras.org
          </p>
        </div>

        <div className="mb-6">
          <AddTaskForm onAdded={refetch} />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : total === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No tasks yet — add your first roadmap item above.
          </div>
        ) : (
          <div className="space-y-8">
            {STATUS_ORDER.map(status => {
              const group = grouped[status] ?? [];
              if (group.length === 0) return null;
              return (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {STATUS_LABELS[status]}
                    </h2>
                    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">
                      {group.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {group.map(task => (
                      <TaskCard key={task.id} task={task} onUpdate={refetch} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
