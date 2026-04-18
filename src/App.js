import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const TEACHERS = [
  { id: 1, name: "Bashir Ahmad Dar", subject: "Head of Institution", role: "HOI" },
  { id: 2, name: "Mohammad Yusuf Wani", subject: "Mathematics" },
  { id: 3, name: "Farida Bano", subject: "Science" },
  { id: 4, name: "Abdul Rashid Mir", subject: "English" },
  { id: 5, name: "Rukhsana Akhter", subject: "Urdu" },
  { id: 6, name: "Ghulam Nabi Shah", subject: "Social Studies" },
  { id: 7, name: "Shaheena Begum", subject: "Hindi" },
  { id: 8, name: "Tariq Ahmad Bhat", subject: "Computer Science" },
  { id: 9, name: "Nusrat Fatima", subject: "Biology" },
  { id: 10, name: "Mushtaq Ahmad Lone", subject: "Physics" },
  { id: 11, name: "Sameena Kouser", subject: "Chemistry" },
  { id: 12, name: "Fayaz Ahmad Rather", subject: "Geography" },
  { id: 13, name: "Gulshan Ara", subject: "History" },
  { id: 14, name: "Showkat Hussain", subject: "Physical Education" },
  { id: 15, name: "Nasreen Jan", subject: "Arts & Craft" },
  { id: 16, name: "Bilal Ahmad Wani", subject: "Economics" },
  { id: 17, name: "Zubeda Bano", subject: "Kashmiri" },
  { id: 18, name: "Arshad Hussain Dar", subject: "Library & Info Sci." },
];

const INITIAL_HOUSES = [
  { id: "azad", name: "Azad House", color: "#ef4444", duties: "Morning assembly arrangement, Sports day coordination, Flag hoisting duty", teacher: "Mohammad Yusuf Wani" },
  { id: "mehjoor", name: "Mehjoor House", color: "#3b82f6", duties: "Library maintenance, Cultural events, Literary competitions", teacher: "Farida Bano" },
  { id: "galib", name: "Galib House", color: "#10b981", duties: "Cleanliness drive, Garden maintenance, Environmental awareness", teacher: "Abdul Rashid Mir" },
  { id: "dhouse", name: "D House", color: "#f59e0b", duties: "Canteen supervision, Visitor management, Notice board updates", teacher: "Rukhsana Akhter" },
];

const TIMETABLE = [
  { period: "1st", time: "8:00–8:45", mon: "Math", tue: "English", wed: "Science", thu: "Urdu", fri: "Social" },
  { period: "2nd", time: "8:45–9:30", mon: "English", tue: "Math", wed: "Hindi", thu: "Science", fri: "Math" },
  { period: "3rd", time: "9:30–10:15", mon: "Science", tue: "Social", wed: "Math", thu: "English", fri: "Science" },
  { period: "Break", time: "10:15–10:30", mon: "—", tue: "—", wed: "—", thu: "—", fri: "—" },
  { period: "4th", time: "10:30–11:15", mon: "Urdu", tue: "Hindi", wed: "English", thu: "Math", fri: "English" },
  { period: "5th", time: "11:15–12:00", mon: "Social", tue: "Science", wed: "Social", thu: "Hindi", fri: "Urdu" },
  { period: "6th", time: "12:00–12:45", mon: "Computer", tue: "PE", wed: "Art", thu: "Computer", fri: "PE" },
];

const INITIAL_NOTICES = [
  { id: 1, title: "Annual Sports Day", body: "Annual Sports Day will be held on 25th April 2026. All students must participate. Dress code: House colours.", date: "16 Apr 2026", important: true },
  { id: 2, title: "Parent-Teacher Meeting", body: "PTM scheduled for 28th April 2026 from 10 AM to 1 PM. All parents are requested to attend.", date: "15 Apr 2026", important: false },
  { id: 3, title: "Exam Schedule Released", body: "Half-yearly examination schedule has been uploaded. Students may collect printed copies from the office.", date: "12 Apr 2026", important: true },
];

const CREDENTIALS = {
  admin: { password: "admin123", role: "admin", name: "Admin" },
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  plus: ["M12 5v14", "M5 12h14"],
  status: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  check: "M20 6L9 17l-5-5",
  x: ["M18 6L6 18", "M6 6l12 12"],
  send: "M22 2L11 13 M22 2L15 22 8 13 2 8l20-6z",
  clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  alert: ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  data: ["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.27 6.96L12 12.01l8.73-5.05", "M12 22.08V12"],
  notice: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0f172a", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", position: "relative", boxShadow: "0 0 60px rgba(99,102,241,0.15)" },
  topBar: { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", padding: "16px 20px 14px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(79,70,229,0.4)" },
  topBarLogo: { width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" },
  topBarTitle: { flex: 1 },
  topBarName: { fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 0.3, lineHeight: 1.2 },
  topBarSub: { fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500 },
  content: { flex: 1, overflowY: "auto", paddingBottom: 80, background: "#0f172a" },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#1e293b", borderTop: "1px solid rgba(99,102,241,0.2)", display: "flex", zIndex: 100, backdropFilter: "blur(12px)" },
  navItem: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 12px", gap: 4, cursor: "pointer", color: active ? "#818cf8" : "#64748b", background: "transparent", border: "none", transition: "color 0.2s" }),
  navLabel: (active) => ({ fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: 0.3 }),
  navDot: { width: 4, height: 4, borderRadius: "50%", background: "#818cf8", marginTop: -2 },

  card: { background: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid rgba(255,255,255,0.06)" },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  body: { fontSize: 13, color: "#94a3b8", lineHeight: 1.6 },

  input: { width: "100%", background: "#0f172a", border: "1.5px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#f1f5f9", outline: "none", boxSizing: "border-box", transition: "border 0.2s", fontFamily: "inherit" },
  select: { width: "100%", background: "#0f172a", border: "1.5px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#f1f5f9", outline: "none", boxSizing: "border-box", appearance: "none", fontFamily: "inherit" },
  textarea: { width: "100%", background: "#0f172a", border: "1.5px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#f1f5f9", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 90, fontFamily: "inherit" },
  label: { fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6, display: "block", letterSpacing: 0.3 },
  btn: (variant = "primary") => ({
    width: "100%", padding: "14px", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3,
    background: variant === "primary" ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : variant === "success" ? "#059669" : variant === "danger" ? "#dc2626" : "#1e293b",
    color: "#fff", transition: "opacity 0.2s, transform 0.1s"
  }),
  pill: (color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: color + "20", color: color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }),
  badge: (color) => ({ background: color + "20", color: color, borderRadius: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700 }),
};

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("student");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [err, setErr] = useState("");

  const handleStudent = () => {
    if (!name || !roll) return setErr("Please fill all fields");
    onLogin({ role: "student", name, roll });
  };
  const handleSendOtp = () => { if (!teacherName) return setErr("Enter your name"); setOtpSent(true); setErr(""); };
  const handleTeacher = () => {
    if (otp !== "1234") return setErr("Invalid OTP (use 1234 for demo)");
    onLogin({ role: "teacher", name: teacherName });
  };
  const handleAdmin = () => {
    if (adminPass !== "admin123") return setErr("Wrong password");
    onLogin({ role: "admin", name: "Admin" });
  };

  const tabs = [{ key: "student", label: "Student" }, { key: "teacher", label: "Teacher" }, { key: "admin", label: "Admin" }];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, fontWeight: 900, color: "#fff", boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }}>P</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", letterSpacing: 0.3 }}>PM SHRI High School</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>Pahoo, Pulwama • Student Portal</div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "#1e293b", borderRadius: 14, padding: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setErr(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", background: tab === t.key ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent", color: tab === t.key ? "#fff" : "#64748b", transition: "all 0.2s", letterSpacing: 0.3 }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background: "#1e293b", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
          {err && <div style={{ background: "#dc262620", color: "#f87171", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, fontWeight: 500 }}>{err}</div>}

          {tab === "student" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Full Name</label>
                <input style={S.input} placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Roll Number</label>
                <input style={S.input} placeholder="e.g. 2024001" value={roll} onChange={e => setRoll(e.target.value)} />
              </div>
              <button style={S.btn("primary")} onClick={handleStudent}>Login as Student</button>
            </div>
          )}

          {tab === "teacher" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Your Name</label>
                <input style={S.input} placeholder="Enter your full name" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
              </div>
              {!otpSent ? (
                <button style={S.btn("primary")} onClick={handleSendOtp}>Send OTP</button>
              ) : (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>OTP (Demo: 1234)</label>
                    <input style={S.input} placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={4} />
                  </div>
                  <button style={S.btn("primary")} onClick={handleTeacher}>Verify & Login</button>
                </>
              )}
            </div>
          )}

          {tab === "admin" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Admin Password</label>
                <input type="password" style={S.input} placeholder="Enter password" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>Demo password: admin123</div>
              </div>
              <button style={S.btn("primary")} onClick={handleAdmin}>Login as Admin</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HOME TAB ────────────────────────────────────────────────────────────────
function HomeTab({ notices, teachers, houses }) {
  const [activeSection, setActiveSection] = useState("notices");

  return (
    <div style={{ padding: "0 0 8px" }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(160deg, #312e81 0%, #1e1b4b 60%, #0f172a 100%)", padding: "24px 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.15)", backdropFilter: "blur(20px)" }} />
        <div style={{ position: "absolute", bottom: -10, left: "30%", width: 80, height: 80, borderRadius: "50%", background: "rgba(139,92,246,0.1)" }} />
        <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Welcome Back</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.2, marginBottom: 6 }}>PM SHRI High School<br /><span style={{ color: "#818cf8" }}>Pahoo, Pulwama</span></div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>J&K School Education Department</div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[["18", "Teachers"], ["4", "Houses"], ["3", "Notices"]].map(([n, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section pills */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px 0", overflowX: "auto" }}>
        {[["notices", "Notice Board"], ["houses", "Houses"], ["teachers", "Teachers"], ["timetable", "Timetable"]].map(([k, l]) => (
          <button key={k} onClick={() => setActiveSection(k)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, border: "1.5px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3, background: activeSection === k ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent", borderColor: activeSection === k ? "transparent" : "rgba(99,102,241,0.3)", color: activeSection === k ? "#fff" : "#64748b", transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        {/* NOTICE BOARD */}
        {activeSection === "notices" && (
          <div>
            <div style={S.sectionTitle}>📢 Notice Board</div>
            {notices.map(n => (
              <div key={n.id} style={{ ...S.card, borderLeft: `3px solid ${n.important ? "#f59e0b" : "#4f46e5"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", flex: 1, paddingRight: 8 }}>{n.title}</div>
                  {n.important && <span style={S.badge("#f59e0b")}>Important</span>}
                </div>
                <div style={S.body}>{n.body}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 8, fontWeight: 600 }}>{n.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* HOUSES */}
        {activeSection === "houses" && (
          <div>
            <div style={S.sectionTitle}>🏛 School Houses</div>
            {houses.map(h => (
              <div key={h.id} style={{ ...S.card, borderLeft: `3px solid ${h.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: h.color + "30", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 18 }}>🏠</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>In-charge: {h.teacher}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}><span style={{ color: "#818cf8", fontWeight: 700 }}>Duties: </span>{h.duties}</div>
              </div>
            ))}
          </div>
        )}

        {/* TEACHERS */}
        {activeSection === "teachers" && (
          <div>
            <div style={S.sectionTitle}>👩‍🏫 Teaching Staff</div>
            {teachers.map(t => (
              <div key={t.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.role === "HOI" ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#1e293b", border: t.role === "HOI" ? "none" : "1.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {t.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{t.subject}</div>
                </div>
                {t.role === "HOI" && <span style={S.badge("#818cf8")}>HOI</span>}
              </div>
            ))}
          </div>
        )}

        {/* TIMETABLE */}
        {activeSection === "timetable" && (
          <div>
            <div style={S.sectionTitle}>📅 Weekly Timetable</div>
            <div style={{ ...S.card, overflowX: "auto", padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "rgba(99,102,241,0.2)" }}>
                    {["Period", "Time", "Mon", "Tue", "Wed", "Thu", "Fri"].map(h => (
                      <th key={h} style={{ padding: "10px 8px", color: "#818cf8", fontWeight: 700, textAlign: "center", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIMETABLE.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: row.period === "Break" ? "rgba(251,191,36,0.05)" : "transparent" }}>
                      <td style={{ padding: "8px", color: row.period === "Break" ? "#fbbf24" : "#94a3b8", fontWeight: 700, textAlign: "center", whiteSpace: "nowrap" }}>{row.period}</td>
                      <td style={{ padding: "8px", color: "#475569", textAlign: "center", whiteSpace: "nowrap" }}>{row.time}</td>
                      {["mon", "tue", "wed", "thu", "fri"].map(d => (
                        <td key={d} style={{ padding: "8px", color: row.period === "Break" ? "#fbbf24" : "#f1f5f9", textAlign: "center", fontWeight: row.period === "Break" ? 700 : 500 }}>{row[d]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CREATE REQUEST TAB ───────────────────────────────────────────────────────
function CreateRequestTab({ user, onSubmit }) {
  const [type, setType] = useState("leave");
  const [form, setForm] = useState({ fromDate: "", toDate: "", reason: "", subject: "", description: "", category: "general" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (type === "leave" && (!form.fromDate || !form.toDate || !form.reason)) return alert("Please fill all required fields.");
    if (type !== "leave" && !form.description) return alert("Please add a description.");
    onSubmit({ id: Date.now(), type, user: user.name, role: user.role, roll: user.roll || "", ...form, status: "Pending", date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), reply: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setForm({ fromDate: "", toDate: "", reason: "", subject: "", description: "", category: "general" });
  };

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#05966920", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={icons.check} size={32} stroke={2.5} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>Request Submitted!</div>
      <div style={{ fontSize: 13, color: "#64748b", textAlign: "center" }}>Your request has been sent to the admin. Check Status tab for updates.</div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={S.sectionTitle}>📝 New Request</div>

      {/* Type selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["leave", "Leave"], ["complaint", "Complaint"], ["general", "General"]].map(([k, l]) => (
          <button key={k} onClick={() => setType(k)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "1.5px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", background: type === k ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent", borderColor: type === k ? "transparent" : "rgba(99,102,241,0.3)", color: type === k ? "#fff" : "#64748b", transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>

      <div style={S.card}>
        {/* Submitter info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#818cf8" }}>{user.name?.charAt(0)}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{user.role}{user.roll ? ` • Roll: ${user.roll}` : ""}</div>
          </div>
        </div>

        {type === "leave" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={S.label}>From Date *</label>
                <input type="date" style={S.input} value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>To Date *</label>
                <input type="date" style={S.input} value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Reason *</label>
              <textarea style={S.textarea} placeholder="Explain reason for leave..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
            </div>
          </>
        )}

        {type === "complaint" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Subject</label>
              <input style={S.input} placeholder="Brief subject of complaint" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Description *</label>
              <textarea style={S.textarea} placeholder="Describe the complaint in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </>
        )}

        {type === "general" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Category</label>
              <select style={S.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="general">General Enquiry</option>
                <option value="certificate">Certificate Request</option>
                <option value="scholarship">Scholarship</option>
                <option value="transfer">Transfer Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Details *</label>
              <textarea style={S.textarea} placeholder="Describe your request..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </>
        )}

        <button style={S.btn("primary")} onClick={handleSubmit}>Submit Request</button>
      </div>
    </div>
  );
}

// ─── STATUS TAB ──────────────────────────────────────────────────────────────
function StatusTab({ requests, user }) {
  const myRequests = requests.filter(r => r.user === user.name && r.role === user.role);

  if (myRequests.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 12 }}>
      <div style={{ fontSize: 40 }}>📋</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>No Requests Yet</div>
      <div style={{ fontSize: 13, color: "#64748b", textAlign: "center" }}>Your submitted requests will appear here.</div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={S.sectionTitle}>📋 My Requests</div>
      {myRequests.map(r => (
        <div key={r.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <span style={S.badge(r.type === "leave" ? "#818cf8" : r.type === "complaint" ? "#f87171" : "#34d399")}>{r.type.toUpperCase()}</span>
              <span style={{ ...S.badge(r.status === "Approved" ? "#059669" : r.status === "Rejected" ? "#dc2626" : "#f59e0b"), marginLeft: 6 }}>{r.status}</span>
            </div>
            <div style={{ fontSize: 11, color: "#475569" }}>{r.date}</div>
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginTop: 4 }}>
            {r.type === "leave" ? `Leave: ${r.fromDate} → ${r.toDate} | ${r.reason}` : r.description || r.reason}
          </div>
          {r.reply && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 10, borderLeft: "3px solid #4f46e5" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", marginBottom: 4 }}>Admin Reply</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{r.reply}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ requests, setRequests, notices, setNotices, teachers, setTeachers, houses, setHouses, onLogout }) {
  const [tab, setTab] = useState("inbox");
  const [replyTexts, setReplyTexts] = useState({});
  const [newNotice, setNewNotice] = useState({ title: "", body: "", important: false });
  const [editTeacher, setEditTeacher] = useState(null);
  const [editHouse, setEditHouse] = useState(null);

  const updateStatus = (id, status) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  const sendReply = (id) => {
    if (!replyTexts[id]) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, reply: replyTexts[id], status: "Approved" } : r));
    setReplyTexts(prev => ({ ...prev, [id]: "" }));
  };
  const addNotice = () => {
    if (!newNotice.title || !newNotice.body) return;
    setNotices(prev => [{ id: Date.now(), ...newNotice, date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...prev]);
    setNewNotice({ title: "", body: "", important: false });
  };

  const tabs = [{ key: "inbox", label: "Inbox", icon: icons.inbox }, { key: "notices", label: "Notices", icon: icons.notice }, { key: "data", label: "Data", icon: icons.data }];

  return (
    <div style={{ ...S.app, background: "#0f172a" }}>
      {/* Admin Top Bar */}
      <div style={{ ...S.topBar, background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
        <div style={S.topBarLogo}>A</div>
        <div style={S.topBarTitle}>
          <div style={S.topBarName}>Admin Dashboard</div>
          <div style={S.topBarSub}>PM SHRI High School</div>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer", color: "#fff", display: "flex" }}>
          <Icon d={icons.logout} size={18} />
        </button>
      </div>

      {/* Admin Tab Bar */}
      <div style={{ display: "flex", background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 64, zIndex: 50 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 0", border: "none", background: "transparent", color: tab === t.key ? "#818cf8" : "#475569", cursor: "pointer", borderBottom: `2px solid ${tab === t.key ? "#818cf8" : "transparent"}`, transition: "all 0.2s" }}>
            <Icon d={t.icon} size={18} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        {/* INBOX */}
        {tab === "inbox" && (
          <div style={{ padding: 20 }}>
            <div style={S.sectionTitle}>📥 All Requests ({requests.length})</div>
            {requests.length === 0 && <div style={{ textAlign: "center", color: "#475569", padding: 40, fontSize: 13 }}>No requests yet.</div>}
            {requests.map(r => (
              <div key={r.id} style={{ ...S.card, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{r.user}</div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{r.role}{r.roll ? ` • ${r.roll}` : ""}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={S.badge(r.type === "leave" ? "#818cf8" : r.type === "complaint" ? "#f87171" : "#34d399")}>{r.type}</span>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{r.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12, padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  {r.type === "leave" ? `${r.fromDate} to ${r.toDate}: ${r.reason}` : r.description || r.reason}
                </div>
                {/* Status buttons */}
                <div style={{ display: "flex", gap: 8, marginBottom: r.status === "Pending" ? 12 : 0 }}>
                  <span style={S.pill(r.status === "Approved" ? "#059669" : r.status === "Rejected" ? "#dc2626" : "#f59e0b")}>{r.status}</span>
                  {r.status === "Pending" && (
                    <>
                      <button onClick={() => updateStatus(r.id, "Approved")} style={{ ...S.btn("success"), width: "auto", padding: "4px 12px", fontSize: 11, borderRadius: 8 }}>Approve</button>
                      <button onClick={() => updateStatus(r.id, "Rejected")} style={{ ...S.btn("danger"), width: "auto", padding: "4px 12px", fontSize: 11, borderRadius: 8 }}>Reject</button>
                    </>
                  )}
                </div>
                {/* Reply */}
                <div style={{ marginTop: 8 }}>
                  <textarea style={{ ...S.textarea, minHeight: 60, fontSize: 12 }} placeholder="Type a reply..." value={replyTexts[r.id] || ""} onChange={e => setReplyTexts(p => ({ ...p, [r.id]: e.target.value }))} />
                  <button onClick={() => sendReply(r.id)} style={{ ...S.btn("primary"), marginTop: 8, padding: "10px" }}>Send Reply</button>
                </div>
                {r.reply && <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(99,102,241,0.1)", borderRadius: 8, fontSize: 12, color: "#818cf8" }}>✓ Replied: {r.reply}</div>}
              </div>
            ))}
          </div>
        )}

        {/* NOTICES */}
        {tab === "notices" && (
          <div style={{ padding: 20 }}>
            <div style={S.sectionTitle}>📢 Publish Notice</div>
            <div style={{ ...S.card, marginBottom: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Title</label>
                <input style={S.input} placeholder="Notice title..." value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Body</label>
                <textarea style={S.textarea} placeholder="Notice details..." value={newNotice.body} onChange={e => setNewNotice({ ...newNotice, body: e.target.value })} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={newNotice.important} onChange={e => setNewNotice({ ...newNotice, important: e.target.checked })} />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Mark as Important</span>
              </label>
              <button style={S.btn("primary")} onClick={addNotice}>Publish Notice</button>
            </div>

            <div style={S.sectionTitle}>Existing Notices</div>
            {notices.map(n => (
              <div key={n.id} style={{ ...S.card, borderLeft: `3px solid ${n.important ? "#f59e0b" : "#4f46e5"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{n.title}</div>
                  <button onClick={() => setNotices(prev => prev.filter(x => x.id !== n.id))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 4 }}><Icon d={icons.x} size={14} /></button>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{n.body}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>{n.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* DATA */}
        {tab === "data" && (
          <div style={{ padding: 20 }}>
            {/* Houses */}
            <div style={S.sectionTitle}>🏛 Houses</div>
            {houses.map(h => (
              <div key={h.id} style={{ ...S.card, borderLeft: `3px solid ${h.color}` }}>
                {editHouse === h.id ? (
                  <div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={S.label}>In-charge Teacher</label>
                      <input style={S.input} value={h.teacher} onChange={e => setHouses(prev => prev.map(x => x.id === h.id ? { ...x, teacher: e.target.value } : x))} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={S.label}>Duties</label>
                      <textarea style={S.textarea} value={h.duties} onChange={e => setHouses(prev => prev.map(x => x.id === h.id ? { ...x, duties: e.target.value } : x))} />
                    </div>
                    <button style={S.btn("success")} onClick={() => setEditHouse(null)}>Save</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{h.teacher}</div>
                    </div>
                    <button onClick={() => setEditHouse(h.id)} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#818cf8", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Edit</button>
                  </div>
                )}
              </div>
            ))}

            {/* Teachers */}
            <div style={{ ...S.sectionTitle, marginTop: 8 }}>👩‍🏫 Teachers</div>
            {teachers.map(t => (
              <div key={t.id} style={{ ...S.card, padding: "10px 14px" }}>
                {editTeacher === t.id ? (
                  <div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={S.label}>Name</label>
                      <input style={S.input} value={t.name} onChange={e => setTeachers(prev => prev.map(x => x.id === t.id ? { ...x, name: e.target.value } : x))} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={S.label}>Subject</label>
                      <input style={S.input} value={t.subject} onChange={e => setTeachers(prev => prev.map(x => x.id === t.id ? { ...x, subject: e.target.value } : x))} />
                    </div>
                    <button style={S.btn("success")} onClick={() => setEditTeacher(null)}>Save</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{t.subject}</div>
                    </div>
                    <button onClick={() => setEditTeacher(t.id)} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#818cf8", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [requests, setRequests] = useState([]);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [teachers, setTeachers] = useState(TEACHERS);
  const [houses, setHouses] = useState(INITIAL_HOUSES);

  if (!user) return <AuthScreen onLogin={u => setUser(u)} />;
  if (user.role === "admin") return <AdminDashboard requests={requests} setRequests={setRequests} notices={notices} setNotices={setNotices} teachers={teachers} setTeachers={setTeachers} houses={houses} setHouses={setHouses} onLogout={() => setUser(null)} />;

  const navItems = [
    { key: "home", label: "Home", icon: icons.home },
    { key: "request", label: "Request", icon: icons.plus },
    { key: "status", label: "Status", icon: icons.status },
  ];

  return (
    <div style={S.app}>
      {/* Top Bar */}
      <div style={S.topBar}>
        <div style={S.topBarLogo}>P</div>
        <div style={S.topBarTitle}>
          <div style={S.topBarName}>PM SHRI High School, Pahoo</div>
          <div style={S.topBarSub}>Pulwama • J&K</div>
        </div>
        <button onClick={() => setUser(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: "#fff", display: "flex" }}>
          <Icon d={icons.logout} size={18} />
        </button>
      </div>

      {/* Welcome strip */}
      <div style={{ background: "rgba(99,102,241,0.08)", padding: "8px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#818cf8" }}>{user.name?.charAt(0)}</div>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>Welcome, <strong style={{ color: "#f1f5f9" }}>{user.name}</strong></span>
        <span style={{ marginLeft: "auto", ...S.badge("#818cf8"), textTransform: "capitalize" }}>{user.role}</span>
      </div>

      {/* Content */}
      <div style={S.content}>
        {activeTab === "home" && <HomeTab notices={notices} teachers={teachers} houses={houses} />}
        {activeTab === "request" && <CreateRequestTab user={user} onSubmit={req => setRequests(p => [req, ...p])} />}
        {activeTab === "status" && <StatusTab requests={requests} user={user} />}
      </div>

      {/* Bottom Nav */}
      <div style={S.bottomNav}>
        {navItems.map(item => (
          <button key={item.key} style={S.navItem(activeTab === item.key)} onClick={() => setActiveTab(item.key)}>
            <Icon d={item.icon} size={22} stroke={activeTab === item.key ? 2.5 : 1.8} />
            <span style={S.navLabel(activeTab === item.key)}>{item.label}</span>
            {activeTab === item.key && <div style={S.navDot} />}
          </button>
        ))}
      </div>
    </div>
  );
}
