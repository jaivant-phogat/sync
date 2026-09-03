"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = "http://127.0.0.1:8000";

type Project = {
  id: string;
  title: string;
  deadline: string | null;
  status: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  estimated_effort: number | null;
};

type RiskData = {
  risk_score: number;
  status: string;
  reasons: string[];
};

type InterventionData = RiskData & {
  generated_text: string;
  recommendation: string | null;
};

const statusColor: Record<string, string> = {
  healthy: "#1F5C57",
  at_risk: "#C77D22",
  critical: "#A63D2F",
};

export default function Dashboard() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [intervention, setIntervention] = useState<InterventionData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskEffort, setTaskEffort] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    const [projectRes, tasksRes, interventionRes] = await Promise.all([
      fetch(`${API_BASE}/projects/${projectId}`),
      fetch(`${API_BASE}/projects/${projectId}/tasks`),
      fetch(`${API_BASE}/projects/${projectId}/intervention`),
    ]);
    setProject(await projectRes.json());
    setTasks(await tasksRes.json());
    setIntervention(await interventionRes.json());
    setLoading(false);
  }

  useEffect(() => {
    if (!projectId) return;
    loadData();
  }, [projectId]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          title: taskTitle,
          description: taskDescription || null,
          deadline: taskDeadline || null,
          estimated_effort: taskEffort ? parseInt(taskEffort) : null,
        }),
      });
      setTaskTitle("");
      setTaskDescription("");
      setTaskDeadline("");
      setTaskEffort("");
      setShowForm(false);
      await loadData();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main style={{ background: "#FAFAF7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", color: "#1C1E21" }}>Loading project...</p>
      </main>
    );
  }

  const riskColor = intervention ? statusColor[intervention.status] ?? "#1C1E21" : "#1C1E21";

  return (
    <main
      style={{
        background: "#FAFAF7",
        minHeight: "100vh",
        color: "#1C1E21",
        fontFamily: "Inter, sans-serif",
        padding: "64px 48px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 14, color: "#6B6B63", marginBottom: 8 }}>SYNC</p>
        <h1
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 40,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {project?.title}
        </h1>
        <p style={{ color: "#6B6B63", marginBottom: 40 }}>
          Due {project?.deadline ?? "no deadline set"}
        </p>

        <section style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
          <span
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 64,
              fontWeight: 600,
              color: riskColor,
              lineHeight: 1,
            }}
          >
            {intervention?.risk_score}
          </span>
          <span style={{ fontSize: 18, color: riskColor, textTransform: "capitalize" }}>
            {intervention?.status.replace("_", " ")}
          </span>
        </section>

        {intervention && intervention.reasons.length > 0 && (
          <ul style={{ marginBottom: 32, paddingLeft: 20, color: "#4A4A45" }}>
            {intervention.reasons.map((reason, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{reason}</li>
            ))}
          </ul>
        )}

        {intervention?.generated_text && (
          <div
            style={{
              borderLeft: `3px solid ${riskColor}`,
              paddingLeft: 20,
              marginBottom: 48,
              color: "#2A2A26",
              lineHeight: 1.6,
            }}
          >
            {intervention.generated_text}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22 }}>
            Tasks
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: "none",
              border: "1px solid #E8E4D9",
              borderRadius: 4,
              padding: "6px 14px",
              fontSize: 14,
              cursor: "pointer",
              color: "#1C1E21",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {showForm ? "Cancel" : "+ Add task"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddTask}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: 20,
              border: "1px solid #E8E4D9",
              borderRadius: 6,
              marginBottom: 24,
            }}
          >
            <input
              required
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              style={{ padding: "8px 10px", border: "1px solid #E8E4D9", borderRadius: 4, fontSize: 14, fontFamily: "Inter, sans-serif" }}
            />
            <input
              placeholder="Description (optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              style={{ padding: "8px 10px", border: "1px solid #E8E4D9", borderRadius: 4, fontSize: 14, fontFamily: "Inter, sans-serif" }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                style={{ flex: 1, padding: "8px 10px", border: "1px solid #E8E4D9", borderRadius: 4, fontSize: 14, fontFamily: "Inter, sans-serif" }}
              />
              <input
                type="number"
                placeholder="Est. hours"
                value={taskEffort}
                onChange={(e) => setTaskEffort(e.target.value)}
                style={{ width: 120, padding: "8px 10px", border: "1px solid #E8E4D9", borderRadius: 4, fontSize: 14, fontFamily: "Inter, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "#1F5C57",
                color: "#FAFAF7",
                border: "none",
                borderRadius: 4,
                padding: "10px 20px",
                fontSize: 14,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              {submitting ? "Adding..." : "Add task"}
            </button>
          </form>
        )}

        <div style={{ borderTop: "1px solid #E8E4D9" }}>
          {tasks.length === 0 && (
            <p style={{ color: "#6B6B63", padding: "16px 0" }}>No tasks yet.</p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "1px solid #E8E4D9",
              }}
            >
              <div>
                <p style={{ fontWeight: 500 }}>{task.title}</p>
                {task.description && (
                  <p style={{ color: "#6B6B63", fontSize: 14, marginTop: 2 }}>{task.description}</p>
                )}
              </div>
              <div style={{ textAlign: "right", fontSize: 14, color: "#6B6B63" }}>
                <p style={{ textTransform: "capitalize" }}>{task.status.replace("_", " ")}</p>
                <p>{task.deadline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}