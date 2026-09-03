"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://127.0.0.1:8000";

export default function NewProject() {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/quick-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_name: creatorName,
          title,
          deadline: deadline || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const project = await res.json();
      router.push(`/dashboard/${project.id}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        background: "#FAFAF7",
        minHeight: "100vh",
        color: "#1C1E21",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h1
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          Start a new project
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#6B6B63" }}>
              Your name
            </label>
            <input
              required
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #E8E4D9",
                borderRadius: 4,
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#6B6B63" }}>
              Project title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marketing Group Project"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #E8E4D9",
                borderRadius: 4,
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#6B6B63" }}>
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #E8E4D9",
                borderRadius: 4,
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {error && <p style={{ color: "#A63D2F", fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#1F5C57",
              color: "#FAFAF7",
              border: "none",
              padding: "12px 24px",
              borderRadius: 4,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            {loading ? "Creating..." : "Create project"}
          </button>
        </form>
      </div>
    </main>
  );
}