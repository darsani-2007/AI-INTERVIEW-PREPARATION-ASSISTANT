import React, { useState } from "react";
import { ImprovementTask, Profile } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Progress, Modal } from "../ui/Card";
import { Button } from "../ui/Button";
import { dbService } from "../../services/db";
import {
  ListTodo,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  Filter,
  Layers,
} from "lucide-react";

interface ImprovementPlanPageProps {
  tasks: ImprovementTask[];
  profile: Profile | null;
  userId: string;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onRefreshTasks: () => void;
}

export const ImprovementPlanPage: React.FC<ImprovementPlanPageProps> = ({
  tasks,
  profile,
  userId,
  onToggleTask,
  onRefreshTasks,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newWeek, setNewWeek] = useState<number>(1);
  const [newCategory, setNewCategory] = useState("Technical");
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (selectedWeek === "all") return true;
    return t.week === selectedWeek;
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    try {
      const newTask: ImprovementTask = {
        id: `custom-task-${Date.now()}`,
        userId,
        week: newWeek,
        title: newTitle.trim(),
        description: newDesc.trim() || "Custom student preparation milestone.",
        category: newCategory,
        completed: false,
      };

      const allTasks = [...tasks, newTask];
      await dbService.saveTasks(userId, allTasks);
      onRefreshTasks();
      setIsAddModalOpen(false);
      setNewTitle("");
      setNewDesc("");
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setIsAdding(false);
    }
  };

  const weekHeaders: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: "Week 1: SQL Mastery, Joins & Aggregations",
      subtitle: "Focus on grouping, having, inner/outer joins, and subquery fundamentals.",
    },
    2: {
      title: "Week 2: Python Data Structures & Pandas Manipulation",
      subtitle: "Review lists, dictionaries, vectorization, and data-cleaning transformations.",
    },
    3: {
      title: "Week 3: Behavioral Questions & The STAR Method",
      subtitle: "Transform college academic and internship projects into compelling stories.",
    },
    4: {
      title: "Week 4: Comprehensive Mock Placement Simulations",
      subtitle: "Complete full 10-question timed mocks and fine-tune delivery.",
    },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Personalized Improvement Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            4-week structured roadmap formulated to overcome weak areas and prepare for {profile?.jobRole || "Target Role"} placements.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto shadow-lg shadow-blue-200"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Custom Milestone
        </Button>
      </div>

      {/* Progress Card (Dark Navy Sleek Theme) */}
      <Card className="bg-[#0F172A] text-white border-0 shadow-lg shadow-slate-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Roadmap Completion</h3>
              <p className="text-xs text-slate-400">
                {completedCount} of {tasks.length} objectives checked off
              </p>
            </div>
          </div>
          <div className="text-3xl font-black text-white">{progressPercent}%</div>
        </div>
        <Progress value={progressPercent} barClassName="bg-blue-500" className="bg-slate-800" />
      </Card>

      {/* Week Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedWeek("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            selectedWeek === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All 4 Weeks
        </button>
        {[1, 2, 3, 4].map((wk) => (
          <button
            key={wk}
            onClick={() => setSelectedWeek(wk)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedWeek === wk
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Week {wk}
          </button>
        ))}
      </div>

      {/* Tasks grouped or filtered */}
      {[1, 2, 3, 4]
        .filter((wk) => selectedWeek === "all" || selectedWeek === wk)
        .map((wk) => {
          const weekTasks = filteredTasks.filter((t) => t.week === wk);
          if (weekTasks.length === 0 && selectedWeek !== "all") return null;

          const meta = weekHeaders[wk] || {
            title: `Week ${wk} Milestones`,
            subtitle: "Assigned preparation tasks",
          };

          return (
            <Card key={wk} className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                      WEEK {wk}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{meta.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{meta.subtitle}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {weekTasks.filter((t) => t.completed).length} / {weekTasks.length} done
                </span>
              </div>

              <div className="space-y-2.5">
                {weekTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id, !task.completed)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      task.completed
                        ? "bg-slate-50/80 border-slate-200 text-slate-400"
                        : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs text-slate-800"
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 cursor-pointer text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id, !task.completed);
                      }}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs sm:text-sm font-semibold leading-snug ${
                            task.completed ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge
                          variant={task.completed ? "success" : "neutral"}
                          className="text-[10px] shrink-0"
                        >
                          {task.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>

                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          task.completed ? "line-through text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {task.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                          {task.category}
                        </span>
                        <span>•</span>
                        <span>Week {task.week} Focus</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

      {/* Add Custom Milestone Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Preparation Milestone"
        description="Append a personal learning task or college assignment to your interview plan"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Build end-to-end Sales Dashboard project"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide context, required tools, or targets..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="block w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Assign to Week
              </label>
              <select
                value={newWeek}
                onChange={(e) => setNewWeek(Number(e.target.value))}
                className="block w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value={1}>Week 1</option>
                <option value={2}>Week 2</option>
                <option value={3}>Week 3</option>
                <option value={4}>Week 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="block w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Projects">Projects</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mock Practice">Mock Practice</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isAdding}
            >
              Add Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
