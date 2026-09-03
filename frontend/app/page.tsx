"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Balancer from "react-wrap-balancer";

const c = {
  bg: "#0A0A0B",
  line: "rgba(255,255,255,0.09)",
  text: "#EDECE9",
  muted: "#8F8D87",
  teal: "#4FBFAE",
};

function Pill({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} style={{ display: "inline-block" }}>
      <Link
        href={href}
        style={{
          display: "inline-block",
          background: primary ? "#F2F1ED" : "transparent",
          color: primary ? "#0A0A0B" : c.text,
          border: primary ? "none" : `1px solid ${c.line}`,
          padding: primary ? "10px 22px" : "9px 21px",
          borderRadius: 999,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main style={{ background: c.bg, color: c.text, fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 48px",
          maxWidth: 1240,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 600 }}>SYNC</span>
          <div style={{ display: "flex", gap: 28 }}>
            <Link href="/product" style={{ color: c.muted, textDecoration: "none", fontSize: 14 }}>
              Product
            </Link>
            <Link href="/pricing" style={{ color: c.muted, textDecoration: "none", fontSize: 14 }}>
              Pricing
            </Link>
            <Link href="/resources" style={{ color: c.muted, textDecoration: "none", fontSize: 14 }}>
              Resources
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/login" style={{ color: c.text, textDecoration: "none", fontSize: 14 }}>
            Log in
          </Link>
          <Pill href="/signup" primary>
            Get SYNC free
          </Pill>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "64px 32px 0" }}>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            fontSize: 60,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          <Balancer>Group work, finally accountable.</Balancer>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          style={{
            fontSize: 17,
            color: c.muted,
            lineHeight: 1.6,
            maxWidth: 540,
            margin: "0 auto",
          }}
        >
          <Balancer>
            SYNC tracks how tasks depend on each other, flags real risk before it becomes a missed
            deadline, and gives every student a clear record of what they actually did.
          </Balancer>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{ maxWidth: 1180, margin: "64px auto 0", padding: "0 32px" }}
      >
        <div
          style={{
            height: 560,
            borderRadius: 16,
            background: "linear-gradient(160deg, #1B3A36 0%, #0F1F1D 45%, #0A0A0B 100%)",
            border: `1px solid ${c.line}`,
            boxShadow: "0 60px 140px rgba(0,0,0,0.55)",
          }}
        />
      </motion.div>

      <section style={{ maxWidth: 680, margin: "0 auto", padding: "140px 32px 60px" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 32 }}
        >
          How it works
        </motion.h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {[
            {
              n: "1",
              title: "Break the assignment into tasks",
              body: "Upload the assignment and SYNC maps out the tasks, deadlines, and how they depend on each other — research before analysis, analysis before the report.",
            },
            {
              n: "2",
              title: "Watch for real risk, not just late tasks",
              body: "SYNC follows the dependency chain. If one person's work is late, it shows exactly who that delay is about to block downstream — before the whole project slips.",
            },
            {
              n: "3",
              title: "Get a specific recommendation",
              body: "Instead of a vague warning, SYNC explains what's actually wrong and proposes a concrete fix — like reassigning a task to balance the workload.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ display: "flex", gap: 20 }}
            >
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: c.teal, width: 28 }}>
                {step.n}
              </span>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>{step.title}</p>
                <p style={{ color: c.muted, lineHeight: 1.6 }}>{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "60px 32px 120px",
          borderTop: `1px solid ${c.line}`,
        }}
      >
        <div style={{ display: "flex", gap: 60 }}>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>For students</p>
            <p style={{ color: c.muted, lineHeight: 1.6 }}>
              Free. Get a clear record of what you actually contributed — no more guessing at
              grading time.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>For schools</p>
            <p style={{ color: c.muted, lineHeight: 1.6 }}>
              Check in on any group, any day, before the deadline hits.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}