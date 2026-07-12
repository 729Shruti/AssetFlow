import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, Building2, Boxes, ArrowLeftRight, CalendarClock,
  Wrench, ClipboardCheck, BarChart3, Bell, LogOut, Plus, Search,
  X, ChevronRight, ChevronDown, Check, AlertTriangle, Clock, Tag,
  QrCode, Filter, User, Users, MapPin, FileText, Eye, EyeOff,
  CheckCircle2, XCircle, PauseCircle, PlayCircle, ArrowRight, Trash2,
  Edit3, ShieldCheck, Package, Settings
} from "lucide-react";

/* ------------------------------------------------------------------
   AssetFlow — Enterprise Asset & Resource Management System
   Design language: "the tag & the ledger"
   Ink navy control surfaces, paper-warm workspace, safety-amber accent,
   die-cut asset-tag chips as the signature recurring motif, condensed
   industrial display type paired with a plain-spoken body face and a
   monospace face reserved for tags / serials / codes.
------------------------------------------------------------------- */

const FONT_LINK_ID = "assetflow-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const COLORS = {
  ink: "#10161F",
  ink2: "#1A2332",
  ink3: "#232E40",
  paper: "#F5F3EE",
  card: "#FFFFFF",
  amber: "#E8A23D",
  amberDeep: "#C97F1F",
  teal: "#1F6F63",
  tealSoft: "#E4F0EC",
  rust: "#B5482A",
  rustSoft: "#F6E5DE",
  slate: "#5B6472",
  slateSoft: "#EDEBE3",
  line: "#E4E1D8",
  lineDark: "#2C3648",
  text: "#181D24",
  violet: "#5B4B8A",
  violetSoft: "#EAE5F4",
};

const FONT_DISPLAY = "'Oswald', sans-serif";
const FONT_BODY = "'IBM Plex Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

/* ------------------------------ seed data ------------------------------ */

const seedDepartments = [
  { id: "d1", name: "Engineering", headId: "e2", parentId: null, status: "Active" },
  { id: "d2", name: "Facilities", headId: "e4", parentId: null, status: "Active" },
  { id: "d3", name: "Field Ops", headId: null, parentId: "d1", status: "Active" },
  { id: "d4", name: "Finance", headId: null, parentId: null, status: "Inactive" },
];

const seedCategories = [
  { id: "c1", name: "Electronics", fields: ["Warranty period"] },
  { id: "c2", name: "Furniture", fields: [] },
  { id: "c3", name: "Vehicles", fields: ["Registration No.", "Fuel type"] },
  { id: "c4", name: "Meeting Rooms", fields: ["Capacity"] },
];

const seedEmployees = [
  { id: "e1", name: "Admin User", email: "admin@assetflow.io", deptId: "d1", role: "Admin", status: "Active" },
  { id: "e2", name: "Priya Nair", email: "priya@assetflow.io", deptId: "d1", role: "Department Head", status: "Active" },
  { id: "e3", name: "Raj Malhotra", email: "raj@assetflow.io", deptId: "d1", role: "Employee", status: "Active" },
  { id: "e4", name: "Sana Iqbal", email: "sana@assetflow.io", deptId: "d2", role: "Department Head", status: "Active" },
  { id: "e5", name: "Devika Rao", email: "devika@assetflow.io", deptId: "d2", role: "Asset Manager", status: "Active" },
  { id: "e6", name: "Karan Shah", email: "karan@assetflow.io", deptId: "d3", role: "Employee", status: "Active" },
];

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

const seedAssets = [
  {
    id: "a1", tag: "AF-0114", name: "Dell Latitude Laptop", categoryId: "c1", serial: "DL-88213",
    acquisitionDate: "2024-02-11", cost: 82000, condition: "Good", location: "HQ - 3F",
    bookable: false, status: "Allocated", holderId: "e2", holderType: "employee",
    expectedReturn: iso(addDays(today, -3)),
    history: [
      { type: "allocation", detail: "Allocated to Priya Nair", date: "2024-02-14" },
    ],
  },
  {
    id: "a2", tag: "AF-0115", name: "Herman Miller Chair", categoryId: "c2", serial: "HM-2291",
    acquisitionDate: "2023-11-02", cost: 41000, condition: "Fair", location: "HQ - 2F",
    bookable: false, status: "Available", holderId: null, holderType: null,
    expectedReturn: null, history: [],
  },
  {
    id: "a3", tag: "AF-0116", name: "Toyota Innova", categoryId: "c3", serial: "TI-9012",
    acquisitionDate: "2022-06-20", cost: 1450000, condition: "Good", location: "HQ - Basement",
    bookable: true, status: "Reserved", holderId: null, holderType: null,
    expectedReturn: null, history: [],
  },
  {
    id: "a4", tag: "AF-0117", name: "Board Room B2", categoryId: "c4", serial: "BR-002",
    acquisitionDate: "2021-01-01", cost: 0, condition: "Good", location: "HQ - 4F",
    bookable: true, status: "Available", holderId: null, holderType: null,
    expectedReturn: null, history: [],
  },
  {
    id: "a5", tag: "AF-0118", name: "MacBook Pro 16\"", categoryId: "c1", serial: "MB-77102",
    acquisitionDate: "2024-08-05", cost: 245000, condition: "New", location: "HQ - 3F",
    bookable: false, status: "Under Maintenance", holderId: null, holderType: null,
    expectedReturn: null,
    history: [{ type: "maintenance", detail: "Screen flicker reported", date: "2026-07-01" }],
  },
  {
    id: "a6", tag: "AF-0119", name: "Projector - Epson EB", categoryId: "c1", serial: "EP-4471",
    acquisitionDate: "2023-03-14", cost: 62000, condition: "Fair", location: "HQ - 4F",
    bookable: true, status: "Available", holderId: null, holderType: null,
    expectedReturn: null, history: [],
  },
  {
    id: "a7", tag: "AF-0120", name: "Standing Desk", categoryId: "c2", serial: "SD-1183",
    acquisitionDate: "2023-09-19", cost: 28000, condition: "Good", location: "HQ - 2F",
    bookable: false, status: "Allocated", holderId: "e6", holderType: "employee",
    expectedReturn: iso(addDays(today, 5)), history: [],
  },
  {
    id: "a8", tag: "AF-0121", name: "Forklift FL-2", categoryId: "c3", serial: "FL-2201",
    acquisitionDate: "2020-05-02", cost: 980000, condition: "Poor", location: "Warehouse",
    bookable: false, status: "Lost", holderId: null, holderType: null,
    expectedReturn: null, history: [{ type: "audit", detail: "Marked missing in Audit AC-02", date: "2026-06-10" }],
  },
];

const seedBookings = [
  {
    id: "b1", assetId: "a3", bookedBy: "e3", start: "2026-07-13T09:00", end: "2026-07-13T10:00",
    status: "Upcoming",
  },
  {
    id: "b2", assetId: "a4", bookedBy: "e6", start: "2026-07-12T14:00", end: "2026-07-12T15:00",
    status: "Completed",
  },
];

const seedMaintenance = [
  {
    id: "m1", assetId: "a5", raisedBy: "e2", issue: "Screen flickers intermittently on boot",
    priority: "High", status: "Approved", technician: "Vendor - CompuFix", date: "2026-07-01",
  },
  {
    id: "m2", assetId: "a2", raisedBy: "e6", issue: "Armrest loose, needs tightening",
    priority: "Low", status: "Pending", technician: null, date: "2026-07-10",
  },
];

const seedAudits = [
  {
    id: "ac1", name: "AC-02 Warehouse Q2", scope: "Warehouse", dateStart: "2026-06-01", dateEnd: "2026-06-10",
    auditors: ["e5"], status: "Closed",
    items: [{ assetId: "a8", result: "Missing" }],
  },
  {
    id: "ac2", name: "AC-03 HQ Floors 2-4", scope: "HQ", dateStart: "2026-07-15", dateEnd: "2026-07-22",
    auditors: ["e5", "e2"], status: "Scheduled",
    items: [],
  },
];

const seedNotifications = [
  { id: "n1", type: "Overdue Return Alert", message: "AF-0114 is overdue for return by Priya Nair", time: "2h ago", read: false },
  { id: "n2", type: "Maintenance Approved", message: "AF-0118 MacBook Pro moved to Under Maintenance", time: "1d ago", read: false },
  { id: "n3", type: "Audit Discrepancy Flagged", message: "AF-0121 flagged Missing in AC-02", time: "3d ago", read: true },
  { id: "n4", type: "Booking Confirmed", message: "Board Room B2 booked for 12 Jul, 2:00 PM", time: "3d ago", read: true },
];

const seedLogs = [
  { id: "l1", actor: "Admin User", action: "Promoted Devika Rao to Asset Manager", time: "2026-07-09 10:14" },
  { id: "l2", actor: "Priya Nair", action: "Approved transfer request for AF-0114", time: "2026-07-08 16:02" },
  { id: "l3", actor: "Devika Rao", action: "Registered asset AF-0121", time: "2020-05-02 09:00" },
];

const STATUS_COLORS = {
  Available: COLORS.teal, Allocated: COLORS.amberDeep, Reserved: COLORS.violet,
  "Under Maintenance": COLORS.rust, Lost: "#7A1F1F", Retired: COLORS.slate, Disposed: "#3A3A3A",
  Active: COLORS.teal, Inactive: COLORS.slate,
  Pending: COLORS.amberDeep, Approved: COLORS.teal, Rejected: COLORS.rust,
  "Technician Assigned": COLORS.violet, "In Progress": COLORS.amberDeep, Resolved: COLORS.teal,
  Upcoming: COLORS.violet, Ongoing: COLORS.amberDeep, Completed: COLORS.teal, Cancelled: COLORS.slate,
  Scheduled: COLORS.violet, Closed: COLORS.slate,
  Verified: COLORS.teal, Missing: COLORS.rust, Damaged: COLORS.amberDeep,
};

/* ------------------------------ small ui bits ------------------------------ */

function TagChip({ children, tone = "ink" }) {
  const toneMap = {
    ink: { bg: COLORS.ink, fg: "#fff" },
    amber: { bg: COLORS.amber, fg: COLORS.ink },
    paper: { bg: "#fff", fg: COLORS.ink },
  };
  const t = toneMap[tone] || toneMap.ink;
  return (
    <span
      className="inline-flex items-center relative pl-4 pr-2 py-0.5 text-xs whitespace-nowrap"
      style={{
        background: t.bg,
        color: t.fg,
        fontFamily: FONT_MONO,
        letterSpacing: "0.02em",
        borderRadius: "2px 6px 6px 2px",
      }}
    >
      <span
        className="absolute left-1 top-1/2"
        style={{
          width: 5, height: 5, borderRadius: "50%",
          background: COLORS.paper, transform: "translateY(-50%)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
        }}
      />
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || COLORS.slate;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full"
      style={{ background: color + "1A", color, border: `1px solid ${color}44` }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      {status}
    </span>
  );
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
      <div>
        {eyebrow && (
          <div
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: COLORS.amberDeep, fontFamily: FONT_MONO, letterSpacing: "0.15em" }}
          >
            {eyebrow}
          </div>
        )}
        <h1 style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }} className="text-2xl font-semibold">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, ...style }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon: Icon, type = "button", disabled }) {
  const base = "inline-flex items-center gap-1.5 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-2.5 py-1.5 text-xs rounded-md", md: "px-3.5 py-2 text-sm rounded-md" };
  const variants = {
    primary: { background: COLORS.ink, color: "#fff" },
    amber: { background: COLORS.amber, color: COLORS.ink },
    outline: { background: "transparent", color: COLORS.ink, border: `1px solid ${COLORS.line}` },
    ghost: { background: "transparent", color: COLORS.slate },
    danger: { background: COLORS.rust, color: "#fff" },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]}`}
      style={{ fontFamily: FONT_BODY, ...variants[variant] }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium mb-1" style={{ color: COLORS.slate }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", fontSize: 14, borderRadius: 6,
  border: `1px solid ${COLORS.line}`, fontFamily: FONT_BODY, background: "#fff", color: COLORS.text,
};

function Modal({ title, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(16,22,31,0.55)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-xl overflow-hidden"
        style={{ maxWidth: wide ? 640 : 460, background: COLORS.card, maxHeight: "88vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }} className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose}><X size={18} color={COLORS.slate} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ background: COLORS.slateSoft }}>
        <Icon size={20} color={COLORS.slate} />
      </div>
      <div className="font-medium" style={{ color: COLORS.ink, fontFamily: FONT_BODY }}>{title}</div>
      {sub && <div className="text-sm mt-1" style={{ color: COLORS.slate }}>{sub}</div>}
    </div>
  );
}

/* ------------------------------ auth screen ------------------------------ */

function AuthScreen({ employees, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", deptId: employees.length ? "" : "" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      const emp = employees.find((x) => x.email.toLowerCase() === form.email.toLowerCase());
      if (!emp) return setError("No account found with that email. Try signing up.");
      if (emp.status === "Inactive") return setError("This account has been deactivated by an admin.");
      onLogin(emp);
    } else {
      if (!form.name || !form.email) return setError("Name and email are required.");
      if (employees.some((x) => x.email.toLowerCase() === form.email.toLowerCase()))
        return setError("An account with that email already exists.");
      onSignup({ name: form.name, email: form.email, deptId: form.deptId || null });
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: COLORS.ink, fontFamily: FONT_BODY }}>
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: COLORS.amber }}>
              <Tag size={16} color={COLORS.ink} />
            </div>
            <span style={{ fontFamily: FONT_DISPLAY, color: "#fff", letterSpacing: "0.04em" }} className="text-lg font-semibold">ASSETFLOW</span>
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: "#fff" }} className="text-5xl leading-tight font-semibold max-w-md">
            Every asset, tagged.<br />Every holder, known.
          </h1>
          <p className="mt-6 max-w-sm" style={{ color: "#9BA5B4" }}>
            One ledger for departments, equipment, bookings and maintenance —
            no spreadsheets, no paper trail, no guessing who has what.
          </p>
        </div>
        <div className="relative z-10 flex gap-6">
          {[["8", "asset states tracked"], ["0", "double-allocations possible"], ["24/7", "audit visibility"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: FONT_MONO, color: COLORS.amber }} className="text-2xl">{n}</div>
              <div className="text-xs mt-1 max-w-[100px]" style={{ color: "#9BA5B4" }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full opacity-10" style={{ background: COLORS.amber }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex gap-1 mb-8 p-1 rounded-lg" style={{ background: COLORS.ink2 }}>
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 text-sm rounded-md font-medium capitalize transition-colors"
                style={{
                  background: mode === m ? COLORS.amber : "transparent",
                  color: mode === m ? COLORS.ink : "#9BA5B4",
                  fontFamily: FONT_BODY,
                }}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <h2 style={{ fontFamily: FONT_DISPLAY, color: "#fff" }} className="text-2xl mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#9BA5B4" }}>
            {mode === "login"
              ? "Log in with your organization email."
              : "New accounts start as Employee. An admin promotes roles from the directory."}
          </p>

          <form onSubmit={submit}>
            {mode === "signup" && (
              <div className="mb-3">
                <span className="block text-xs font-medium mb-1" style={{ color: "#9BA5B4" }}>Full name</span>
                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Alvarez" />
              </div>
            )}
            <div className="mb-3">
              <span className="block text-xs font-medium mb-1" style={{ color: "#9BA5B4" }}>Work email</span>
              <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
            </div>
            <div className="mb-1">
              <span className="block text-xs font-medium mb-1" style={{ color: "#9BA5B4" }}>Password</span>
              <div className="relative">
                <input style={inputStyle} type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={15} color={COLORS.slate} /> : <Eye size={15} color={COLORS.slate} />}
                </button>
              </div>
            </div>
            {mode === "login" && (
              <div className="text-right mb-4">
                <button type="button" className="text-xs" style={{ color: COLORS.amber }}>Forgot password?</button>
              </div>
            )}
            {mode === "signup" && <div className="mb-4" />}
            {error && (
              <div className="text-xs mb-3 px-3 py-2 rounded-md" style={{ background: "rgba(181,72,42,0.15)", color: "#E8917A" }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-md font-medium text-sm"
              style={{ background: COLORS.amber, color: COLORS.ink, fontFamily: FONT_BODY }}
            >
              {mode === "login" ? "Log in" : "Create employee account"}
            </button>
          </form>
          <p className="text-xs mt-6" style={{ color: "#5B6472" }}>
            Try admin@assetflow.io to explore the Admin view, or priya@assetflow.io for Department Head.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ layout ------------------------------ */

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Department Head", "Asset Manager", "Employee"] },
  { id: "org", label: "Organization Setup", icon: Building2, roles: ["Admin"] },
  { id: "assets", label: "Asset Directory", icon: Boxes, roles: ["Admin", "Department Head", "Asset Manager", "Employee"] },
  { id: "allocation", label: "Allocation & Transfer", icon: ArrowLeftRight, roles: ["Admin", "Department Head", "Asset Manager", "Employee"] },
  { id: "booking", label: "Resource Booking", icon: CalendarClock, roles: ["Admin", "Department Head", "Asset Manager", "Employee"] },
  { id: "maintenance", label: "Maintenance", icon: Wrench, roles: ["Admin", "Department Head", "Asset Manager", "Employee"] },
  { id: "audit", label: "Asset Audit", icon: ClipboardCheck, roles: ["Admin", "Asset Manager"] },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, roles: ["Admin", "Department Head", "Asset Manager"] },
  { id: "logs", label: "Activity & Notifications", icon: Bell, roles: ["Admin", "Department Head", "Asset Manager", "Employee"] },
];

function Sidebar({ page, setPage, user, onLogout }) {
  const items = NAV.filter((n) => n.roles.includes(user.role));
  return (
    <div className="w-60 shrink-0 flex flex-col" style={{ background: COLORS.ink, height: "100vh", position: "sticky", top: 0 }}>
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: COLORS.amber }}>
          <Tag size={14} color={COLORS.ink} />
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, color: "#fff", letterSpacing: "0.04em" }} className="font-semibold">ASSETFLOW</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md mb-1 text-sm text-left transition-colors"
              style={{
                background: active ? COLORS.ink3 : "transparent",
                color: active ? "#fff" : "#9BA5B4",
                fontFamily: FONT_BODY,
                borderLeft: active ? `2px solid ${COLORS.amber}` : "2px solid transparent",
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="p-4 mx-3 mb-4 rounded-lg" style={{ background: COLORS.ink2 }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.amber, color: COLORS.ink }}>
            {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="text-sm truncate" style={{ color: "#fff" }}>{user.name}</div>
            <div className="text-xs truncate" style={{ color: COLORS.amber }}>{user.role}</div>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md" style={{ color: "#9BA5B4", border: `1px solid ${COLORS.ink3}` }}>
          <LogOut size={12} /> Log out
        </button>
      </div>
    </div>
  );
}

function Topbar({ user, notifications, search, setSearch }) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10" style={{ background: COLORS.paper, borderBottom: `1px solid ${COLORS.line}` }}>
      <div className="relative w-80 max-w-full">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color={COLORS.slate} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search asset tag, serial, employee…"
          style={{ ...inputStyle, paddingLeft: 32, background: COLORS.card }}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={19} color={COLORS.ink} />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: COLORS.rust }}>
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Dashboard ------------------------------ */

function Dashboard({ ctx, setPage }) {
  const { assets, bookings, maintenance, employees, user } = ctx;
  const isOverdue = (a) => a.status === "Allocated" && a.expectedReturn && a.expectedReturn < iso(today);
  const kpis = [
    { label: "Assets Available", value: assets.filter((a) => a.status === "Available").length, icon: Boxes, tone: COLORS.teal },
    { label: "Assets Allocated", value: assets.filter((a) => a.status === "Allocated").length, icon: ArrowLeftRight, tone: COLORS.amberDeep },
    { label: "Maintenance Today", value: maintenance.filter((m) => m.date === iso(today) || ["Approved", "In Progress", "Technician Assigned"].includes(m.status)).length, icon: Wrench, tone: COLORS.rust },
    { label: "Active Bookings", value: bookings.filter((b) => b.status === "Upcoming" || b.status === "Ongoing").length, icon: CalendarClock, tone: COLORS.violet },
    { label: "Pending Transfers", value: 1, icon: ArrowLeftRight, tone: COLORS.amberDeep },
    { label: "Upcoming Returns", value: assets.filter((a) => a.status === "Allocated" && a.expectedReturn && a.expectedReturn >= iso(today)).length, icon: Clock, tone: COLORS.teal },
  ];
  const overdue = assets.filter(isOverdue);
  const upcomingReturns = assets.filter((a) => a.status === "Allocated" && a.expectedReturn && a.expectedReturn >= iso(today));

  return (
    <div>
      <SectionHeader
        eyebrow={`Welcome, ${user.role}`}
        title="Operational snapshot"
        action={
          <div className="flex gap-2">
            <Btn variant="outline" icon={Plus} onClick={() => setPage("assets")}>Register Asset</Btn>
            <Btn variant="outline" icon={CalendarClock} onClick={() => setPage("booking")}>Book Resource</Btn>
            <Btn variant="amber" icon={Wrench} onClick={() => setPage("maintenance")}>Raise Request</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="w-8 h-8 rounded-md flex items-center justify-center mb-3" style={{ background: k.tone + "1A" }}>
              <k.icon size={16} color={k.tone} />
            </div>
            <div style={{ fontFamily: FONT_MONO, color: COLORS.ink }} className="text-2xl font-semibold">{k.value}</div>
            <div className="text-xs mt-1" style={{ color: COLORS.slate }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} color={COLORS.rust} />
            <h3 style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }} className="font-semibold">Overdue returns</h3>
          </div>
          {overdue.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="Nothing overdue" sub="All allocations are within their expected return window." />
          ) : (
            <div className="space-y-2">
              {overdue.map((a) => {
                const holder = employees.find((e) => e.id === a.holderId);
                return (
                  <div key={a.id} className="flex items-center justify-between p-2.5 rounded-md" style={{ background: COLORS.rustSoft }}>
                    <div className="flex items-center gap-2">
                      <TagChip>{a.tag}</TagChip>
                      <span className="text-sm" style={{ color: COLORS.ink }}>{a.name}</span>
                    </div>
                    <div className="text-xs text-right" style={{ color: COLORS.rust }}>
                      held by {holder?.name || "—"}<br />due {a.expectedReturn}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} color={COLORS.teal} />
            <h3 style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }} className="font-semibold">Upcoming returns</h3>
          </div>
          {upcomingReturns.length === 0 ? (
            <EmptyState icon={Package} title="No returns scheduled" />
          ) : (
            <div className="space-y-2">
              {upcomingReturns.map((a) => {
                const holder = employees.find((e) => e.id === a.holderId);
                return (
                  <div key={a.id} className="flex items-center justify-between p-2.5 rounded-md" style={{ background: COLORS.tealSoft }}>
                    <div className="flex items-center gap-2">
                      <TagChip>{a.tag}</TagChip>
                      <span className="text-sm" style={{ color: COLORS.ink }}>{a.name}</span>
                    </div>
                    <div className="text-xs text-right" style={{ color: COLORS.teal }}>
                      held by {holder?.name || "—"}<br />due {a.expectedReturn}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------ Organization Setup (Admin) ------------------------------ */

function OrgSetup(ctx) {
  const { departments, setDepartments, categories, setCategories, employees, setEmployees, addLog } = ctx;
  const [tab, setTab] = useState("dept");
  const [modal, setModal] = useState(null);

  const tabs = [
    { id: "dept", label: "Departments" },
    { id: "cat", label: "Asset Categories" },
    { id: "emp", label: "Employee Directory" },
  ];

  return (
    <div>
      <SectionHeader eyebrow="Admin only" title="Organization Setup" />
      <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: COLORS.slateSoft }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 text-sm rounded-md font-medium"
            style={{ background: tab === t.id ? COLORS.card : "transparent", color: tab === t.id ? COLORS.ink : COLORS.slate, fontFamily: FONT_BODY }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dept" && (
        <Card>
          <div className="flex justify-between items-center p-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <div className="text-sm" style={{ color: COLORS.slate }}>{departments.length} departments</div>
            <Btn icon={Plus} onClick={() => setModal({ type: "dept" })}>New department</Btn>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: COLORS.slate, textAlign: "left" }} className="text-xs uppercase">
                <th className="px-4 py-2">Name</th><th className="px-4 py-2">Head</th><th className="px-4 py-2">Parent</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.ink }}>{d.name}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{employees.find((e) => e.id === d.headId)?.name || "— unassigned —"}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{departments.find((p) => p.id === d.parentId)?.name || "—"}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => setDepartments(departments.map((x) => x.id === d.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x))} className="text-xs" style={{ color: COLORS.amberDeep }}>
                      {d.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "cat" && (
        <Card>
          <div className="flex justify-between items-center p-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <div className="text-sm" style={{ color: COLORS.slate }}>{categories.length} categories</div>
            <Btn icon={Plus} onClick={() => setModal({ type: "cat" })}>New category</Btn>
          </div>
          <div className="grid md:grid-cols-2 gap-3 p-4">
            {categories.map((c) => (
              <div key={c.id} className="p-3 rounded-md" style={{ border: `1px solid ${COLORS.line}` }}>
                <div className="font-medium" style={{ color: COLORS.ink }}>{c.name}</div>
                <div className="text-xs mt-1" style={{ color: COLORS.slate }}>
                  {c.fields.length ? `Custom fields: ${c.fields.join(", ")}` : "No custom fields"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "emp" && (
        <Card>
          <div className="flex justify-between items-center p-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <div className="text-sm" style={{ color: COLORS.slate }}>{employees.length} employees · roles are assigned here only</div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: COLORS.slate, textAlign: "left" }} className="text-xs uppercase">
                <th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Department</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.ink }}>{e.name}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{e.email}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{departments.find((d) => d.id === e.deptId)?.name || "—"}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={e.role}
                      onChange={(ev) => {
                        setEmployees(employees.map((x) => x.id === e.id ? { ...x, role: ev.target.value } : x));
                        addLog(`Promoted ${e.name} to ${ev.target.value}`);
                      }}
                      style={{ ...inputStyle, padding: "4px 8px", width: "auto" }}
                      disabled={e.role === "Admin"}
                    >
                      {["Employee", "Department Head", "Asset Manager", "Admin"].map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => setEmployees(employees.map((x) => x.id === e.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x))}
                      className="text-xs" style={{ color: COLORS.amberDeep }}
                    >
                      {e.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modal?.type === "dept" && (
        <DeptModal onClose={() => setModal(null)} departments={departments} employees={employees}
          onSave={(d) => { setDepartments([...departments, { ...d, id: "d" + (departments.length + 1) }]); setModal(null); }} />
      )}
      {modal?.type === "cat" && (
        <CatModal onClose={() => setModal(null)}
          onSave={(c) => { setCategories([...categories, { ...c, id: "c" + (categories.length + 1) }]); setModal(null); }} />
      )}
    </div>
  );
}

function DeptModal({ onClose, onSave, departments, employees }) {
  const [name, setName] = useState("");
  const [headId, setHeadId] = useState("");
  const [parentId, setParentId] = useState("");
  return (
    <Modal title="New department" onClose={onClose}>
      <Field label="Department name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marketing" /></Field>
      <Field label="Department Head">
        <select style={inputStyle} value={headId} onChange={(e) => setHeadId(e.target.value)}>
          <option value="">— unassigned —</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>
      <Field label="Parent department (optional)">
        <select style={inputStyle} value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">— none —</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </Field>
      <Btn onClick={() => name && onSave({ name, headId: headId || null, parentId: parentId || null, status: "Active" })}>Save department</Btn>
    </Modal>
  );
}

function CatModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState("");
  return (
    <Modal title="New asset category" onClose={onClose}>
      <Field label="Category name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. IT Equipment" /></Field>
      <Field label="Custom fields (comma separated, optional)"><input style={inputStyle} value={fields} onChange={(e) => setFields(e.target.value)} placeholder="Warranty period, License key" /></Field>
      <Btn onClick={() => name && onSave({ name, fields: fields ? fields.split(",").map((f) => f.trim()).filter(Boolean) : [] })}>Save category</Btn>
    </Modal>
  );
}

/* ------------------------------ Asset Directory ------------------------------ */

function AssetDirectory(ctx) {
  const { assets, setAssets, categories, employees, departments, search, addLog, user } = ctx;
  const [modal, setModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [selected, setSelected] = useState(null);

  const canRegister = ["Admin", "Asset Manager"].includes(user.role);

  const filtered = assets.filter((a) => {
    const matchesSearch = !search || [a.tag, a.serial, a.name].some((f) => f.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "All" || a.status === filterStatus;
    const matchesCat = filterCat === "All" || a.categoryId === filterCat;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const statuses = ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];

  return (
    <div>
      <SectionHeader
        eyebrow="Central registry"
        title="Asset Directory"
        action={canRegister && <Btn icon={Plus} onClick={() => setModal("new")}>Register Asset</Btn>}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <select style={{ ...inputStyle, width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option>All</option>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select style={{ ...inputStyle, width: "auto" }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="All">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex items-center gap-1.5 text-xs px-2" style={{ color: COLORS.slate }}>
          <Filter size={13} /> {filtered.length} of {assets.length} assets
        </div>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: COLORS.slate, textAlign: "left" }} className="text-xs uppercase">
              <th className="px-4 py-2.5">Tag</th><th className="px-4 py-2.5">Name</th><th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Location</th><th className="px-4 py-2.5">Condition</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ borderTop: `1px solid ${COLORS.line}` }} className="cursor-pointer hover:bg-black/[0.015]" onClick={() => setSelected(a)}>
                <td className="px-4 py-2.5"><TagChip>{a.tag}</TagChip></td>
                <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.ink }}>{a.name}{a.bookable && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: COLORS.violetSoft, color: COLORS.violet }}>bookable</span>}</td>
                <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{categories.find((c) => c.id === a.categoryId)?.name}</td>
                <td className="px-4 py-2.5" style={{ color: COLORS.slate }}><span className="inline-flex items-center gap-1"><MapPin size={12} />{a.location}</span></td>
                <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{a.condition}</td>
                <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-2.5 text-right"><ChevronRight size={15} color={COLORS.slate} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}><EmptyState icon={Search} title="No assets match your filters" /></td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {modal === "new" && (
        <NewAssetModal categories={categories} onClose={() => setModal(null)}
          onSave={(a) => {
            const tagNum = (assets.length + 1).toString().padStart(4, "0");
            setAssets([...assets, { ...a, id: "a" + (assets.length + 1), tag: `AF-${tagNum}`, status: "Available", holderId: null, holderType: null, expectedReturn: null, history: [] }]);
            addLog(`Registered asset AF-${tagNum} — ${a.name}`);
            setModal(null);
          }} />
      )}

      {selected && (
        <Modal title={`${selected.tag} — ${selected.name}`} onClose={() => setSelected(null)} wide>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Serial number</span><span style={{ fontFamily: FONT_MONO }}>{selected.serial}</span></div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Category</span>{categories.find((c) => c.id === selected.categoryId)?.name}</div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Acquisition date</span>{selected.acquisitionDate}</div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Acquisition cost</span>₹{selected.cost.toLocaleString("en-IN")}</div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Condition</span>{selected.condition}</div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Location</span>{selected.location}</div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Status</span><StatusBadge status={selected.status} /></div>
            <div><span className="text-xs block" style={{ color: COLORS.slate }}>Holder</span>{employees.find((e) => e.id === selected.holderId)?.name || "— none —"}</div>
          </div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}>History</h4>
          {selected.history.length === 0 ? (
            <div className="text-sm" style={{ color: COLORS.slate }}>No allocation or maintenance history yet.</div>
          ) : (
            <div className="space-y-2">
              {selected.history.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 rounded-md" style={{ background: COLORS.paper }}>
                  <span>{h.detail}</span><span className="text-xs" style={{ color: COLORS.slate }}>{h.date}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function NewAssetModal({ categories, onClose, onSave }) {
  const [f, setF] = useState({ name: "", categoryId: categories[0]?.id || "", serial: "", acquisitionDate: iso(today), cost: 0, condition: "New", location: "", bookable: false });
  return (
    <Modal title="Register Asset" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Asset name"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Lenovo ThinkPad" /></Field>
        <Field label="Category">
          <select style={inputStyle} value={f.categoryId} onChange={(e) => setF({ ...f, categoryId: e.target.value })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Serial number"><input style={inputStyle} value={f.serial} onChange={(e) => setF({ ...f, serial: e.target.value })} placeholder="Manufacturer serial" /></Field>
        <Field label="Acquisition date"><input type="date" style={inputStyle} value={f.acquisitionDate} onChange={(e) => setF({ ...f, acquisitionDate: e.target.value })} /></Field>
        <Field label="Acquisition cost (₹)"><input type="number" style={inputStyle} value={f.cost} onChange={(e) => setF({ ...f, cost: Number(e.target.value) })} /></Field>
        <Field label="Condition">
          <select style={inputStyle} value={f.condition} onChange={(e) => setF({ ...f, condition: e.target.value })}>
            {["New", "Good", "Fair", "Poor"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Location"><input style={inputStyle} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="e.g. HQ - 3F" /></Field>
        <Field label="Shared / bookable resource">
          <select style={inputStyle} value={f.bookable ? "yes" : "no"} onChange={(e) => setF({ ...f, bookable: e.target.value === "yes" })}>
            <option value="no">No — allocate to individuals</option>
            <option value="yes">Yes — bookable by time slot</option>
          </select>
        </Field>
      </div>
      <p className="text-xs mb-3" style={{ color: COLORS.slate }}>An Asset Tag (e.g. AF-0001) is generated automatically on save.</p>
      <Btn onClick={() => f.name && f.location && onSave(f)}>Register asset</Btn>
    </Modal>
  );
}

/* ------------------------------ Allocation & Transfer ------------------------------ */

function Allocation(ctx) {
  const { assets, setAssets, employees, departments, addLog, notify, user } = ctx;
  const [modal, setModal] = useState(null);
  const [conflictAsset, setConflictAsset] = useState(null);
  const [transfers, setTransfers] = useState([]);

  const allocatable = assets.filter((a) => !a.bookable);

  function requestAllocate(assetId, holderId, expectedReturn) {
    const asset = assets.find((a) => a.id === assetId);
    if (asset.status === "Allocated") {
      setConflictAsset({ asset, requestedBy: holderId });
      return;
    }
    setAssets(assets.map((a) => a.id === assetId ? { ...a, status: "Allocated", holderId, holderType: "employee", expectedReturn, history: [...a.history, { type: "allocation", detail: `Allocated to ${employees.find((e) => e.id === holderId)?.name}`, date: iso(today) }] } : a));
    addLog(`Allocated ${asset.tag} to ${employees.find((e) => e.id === holderId)?.name}`);
    notify("Asset Assigned", `${asset.tag} allocated to ${employees.find((e) => e.id === holderId)?.name}`);
    setModal(null);
  }

  function raiseTransferRequest(asset, requestedBy) {
    setTransfers([...transfers, { id: "t" + (transfers.length + 1), assetId: asset.id, from: asset.holderId, to: requestedBy, status: "Requested" }]);
    addLog(`Transfer requested for ${asset.tag}`);
    setConflictAsset(null);
  }

  function approveTransfer(t) {
    const asset = assets.find((a) => a.id === t.assetId);
    setAssets(assets.map((a) => a.id === t.assetId ? { ...a, holderId: t.to, expectedReturn: iso(addDays(today, 14)), history: [...a.history, { type: "transfer", detail: `Transferred to ${employees.find((e) => e.id === t.to)?.name}`, date: iso(today) }] } : a));
    setTransfers(transfers.map((x) => x.id === t.id ? { ...x, status: "Re-allocated" } : x));
    addLog(`Transfer approved: ${asset.tag} re-allocated`);
    notify("Transfer Approved", `${asset.tag} transferred to ${employees.find((e) => e.id === t.to)?.name}`);
  }

  function markReturned(asset) {
    setAssets(assets.map((a) => a.id === asset.id ? { ...a, status: "Available", holderId: null, holderType: null, expectedReturn: null, history: [...a.history, { type: "return", detail: "Marked returned, condition checked", date: iso(today) }] } : a));
    addLog(`${asset.tag} marked returned`);
  }

  return (
    <div>
      <SectionHeader eyebrow="Who holds what" title="Allocation & Transfer" action={<Btn icon={Plus} onClick={() => setModal("new")}>Allocate Asset</Btn>} />

      <Card className="mb-5">
        <div className="p-4 text-sm font-semibold" style={{ borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ink, fontFamily: FONT_DISPLAY }}>Current allocations</div>
        <table className="w-full text-sm">
          <thead><tr className="text-xs uppercase" style={{ color: COLORS.slate, textAlign: "left" }}>
            <th className="px-4 py-2">Tag</th><th className="px-4 py-2">Asset</th><th className="px-4 py-2">Holder</th><th className="px-4 py-2">Expected return</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th>
          </tr></thead>
          <tbody>
            {allocatable.filter((a) => a.status === "Allocated").map((a) => {
              const overdue = a.expectedReturn && a.expectedReturn < iso(today);
              return (
                <tr key={a.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                  <td className="px-4 py-2.5"><TagChip>{a.tag}</TagChip></td>
                  <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.ink }}>{a.name}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{employees.find((e) => e.id === a.holderId)?.name}</td>
                  <td className="px-4 py-2.5" style={{ color: overdue ? COLORS.rust : COLORS.slate }}>{a.expectedReturn}{overdue && " · overdue"}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={overdue ? "Lost" : "Allocated"} /></td>
                  <td className="px-4 py-2.5 text-right"><Btn size="sm" variant="outline" onClick={() => markReturned(a)}>Mark returned</Btn></td>
                </tr>
              );
            })}
            {allocatable.filter((a) => a.status === "Allocated").length === 0 && <tr><td colSpan={6}><EmptyState icon={Users} title="No active allocations" /></td></tr>}
          </tbody>
        </table>
      </Card>

      {transfers.length > 0 && (
        <Card>
          <div className="p-4 text-sm font-semibold" style={{ borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ink, fontFamily: FONT_DISPLAY }}>Transfer requests</div>
          <table className="w-full text-sm">
            <thead><tr className="text-xs uppercase" style={{ color: COLORS.slate, textAlign: "left" }}>
              <th className="px-4 py-2">Asset</th><th className="px-4 py-2">From</th><th className="px-4 py-2">To</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th>
            </tr></thead>
            <tbody>
              {transfers.map((t) => {
                const asset = assets.find((a) => a.id === t.assetId);
                return (
                  <tr key={t.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                    <td className="px-4 py-2.5"><TagChip>{asset.tag}</TagChip></td>
                    <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{employees.find((e) => e.id === t.from)?.name}</td>
                    <td className="px-4 py-2.5" style={{ color: COLORS.slate }}>{employees.find((e) => e.id === t.to)?.name}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={t.status === "Re-allocated" ? "Completed" : "Pending"} /></td>
                    <td className="px-4 py-2.5 text-right">
                      {t.status === "Requested" && ["Admin", "Department Head", "Asset Manager"].includes(user.role) && (
                        <Btn size="sm" onClick={() => approveTransfer(t)}>Approve</Btn>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {modal === "new" && (
        <AllocateModal assets={allocatable.filter((a) => a.status !== "Allocated")} employees={employees}
          onClose={() => setModal(null)} onSave={requestAllocate} />
      )}

      {conflictAsset && (
        <Modal title="Asset already allocated" onClose={() => setConflictAsset(null)}>
          <div className="flex items-center gap-2 mb-3 p-3 rounded-md" style={{ background: COLORS.rustSoft }}>
            <AlertTriangle size={16} color={COLORS.rust} />
            <span className="text-sm" style={{ color: COLORS.rust }}>
              {conflictAsset.asset.tag} is currently held by {employees.find((e) => e.id === conflictAsset.asset.holderId)?.name}.
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: COLORS.slate }}>
            You can't allocate an asset that's already taken. Raise a transfer request instead — it will need approval from an Asset Manager or Department Head.
          </p>
          <Btn variant="amber" icon={ArrowRight} onClick={() => raiseTransferRequest(conflictAsset.asset, conflictAsset.requestedBy)}>
            Raise Transfer Request
          </Btn>
        </Modal>
      )}
    </div>
  );
}

function AllocateModal({ assets, employees, onClose, onSave }) {
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [holderId, setHolderId] = useState(employees[0]?.id || "");
  const [expectedReturn, setExpectedReturn] = useState(iso(addDays(today, 14)));
  return (
    <Modal title="Allocate Asset" onClose={onClose}>
      <Field label="Asset">
        <select style={inputStyle} value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.tag} — {a.name}</option>)}
        </select>
      </Field>
      <Field label="Allocate to employee">
        <select style={inputStyle} value={holderId} onChange={(e) => setHolderId(e.target.value)}>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>
      <Field label="Expected return date (optional)"><input type="date" style={inputStyle} value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} /></Field>
      <Btn onClick={() => assetId && holderId && onSave(assetId, holderId, expectedReturn)}>Allocate</Btn>
    </Modal>
  );
}

/* ------------------------------ Resource Booking ------------------------------ */

function Booking(ctx) {
  const { assets, bookings, setBookings, employees, addLog, notify } = ctx;
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const resources = assets.filter((a) => a.bookable);
  const [resourceId, setResourceId] = useState(resources[0]?.id || "");

  function overlaps(start, end, existing) {
    return existing.some((b) => b.resourceId === undefined ? false : false);
  }

  function tryBook(resId, start, end, bookedBy) {
    const s = new Date(start), e = new Date(end);
    if (e <= s) { setError("End time must be after start time."); return; }
    const clash = bookings.find((b) => b.assetId === resId && b.status !== "Cancelled" && s < new Date(b.end) && e > new Date(b.start));
    if (clash) {
      setError(`Overlaps with an existing booking (${clash.start.replace("T", " ")} – ${clash.end.replace("T", " ")}). Choose another slot.`);
      return;
    }
    setError("");
    setBookings([...bookings, { id: "b" + (bookings.length + 1), assetId: resId, bookedBy, start, end, status: "Upcoming" }]);
    const res = assets.find((a) => a.id === resId);
    addLog(`Booked ${res.tag} for ${start} – ${end}`);
    notify("Booking Confirmed", `${res.name} booked for ${start.replace("T", " ")}`);
    setModal(false);
  }

  function cancelBooking(b) {
    setBookings(bookings.map((x) => x.id === b.id ? { ...x, status: "Cancelled" } : x));
    addLog(`Cancelled booking ${b.id}`);
    notify("Booking Cancelled", `Booking for ${assets.find((a) => a.id === b.assetId)?.name} cancelled`);
  }

  return (
    <div>
      <SectionHeader eyebrow="Time-slot booking" title="Resource Booking" action={<Btn icon={Plus} onClick={() => { setError(""); setModal(true); }}>Book Resource</Btn>} />

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {resources.map((r) => {
          const resBookings = bookings.filter((b) => b.assetId === r.id && b.status !== "Cancelled").sort((a, b) => a.start.localeCompare(b.start));
          return (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><TagChip>{r.tag}</TagChip><span className="font-medium" style={{ color: COLORS.ink }}>{r.name}</span></div>
                <StatusBadge status={r.status} />
              </div>
              {resBookings.length === 0 ? (
                <div className="text-xs" style={{ color: COLORS.slate }}>No upcoming bookings</div>
              ) : (
                <div className="space-y-1.5">
                  {resBookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-md" style={{ background: COLORS.paper }}>
                      <span style={{ fontFamily: FONT_MONO, color: COLORS.ink }}>{b.start.replace("T", " ")} – {b.end.slice(11)}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: COLORS.slate }}>{employees.find((e) => e.id === b.bookedBy)?.name}</span>
                        <StatusBadge status={b.status} />
                        {b.status !== "Completed" && b.status !== "Cancelled" && (
                          <button onClick={() => cancelBooking(b)} className="text-xs" style={{ color: COLORS.rust }}>Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {modal && (
        <Modal title="Book Resource" onClose={() => setModal(false)}>
          <BookingForm resources={resources} employees={employees} onSave={tryBook} error={error} />
        </Modal>
      )}
    </div>
  );
}

function BookingForm({ resources, employees, onSave, error }) {
  const [resourceId, setResourceId] = useState(resources[0]?.id || "");
  const [bookedBy, setBookedBy] = useState(employees[0]?.id || "");
  const [date, setDate] = useState(iso(today));
  const [startT, setStartT] = useState("09:00");
  const [endT, setEndT] = useState("10:00");
  return (
    <div>
      <Field label="Resource">
        <select style={inputStyle} value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
          {resources.map((r) => <option key={r.id} value={r.id}>{r.tag} — {r.name}</option>)}
        </select>
      </Field>
      <Field label="Booked by">
        <select style={inputStyle} value={bookedBy} onChange={(e) => setBookedBy(e.target.value)}>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Date"><input type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Start"><input type="time" style={inputStyle} value={startT} onChange={(e) => setStartT(e.target.value)} /></Field>
        <Field label="End"><input type="time" style={inputStyle} value={endT} onChange={(e) => setEndT(e.target.value)} /></Field>
      </div>
      {error && <div className="text-xs mb-3 px-3 py-2 rounded-md" style={{ background: COLORS.rustSoft, color: COLORS.rust }}>{error}</div>}
      <Btn onClick={() => onSave(resourceId, `${date}T${startT}`, `${date}T${endT}`, bookedBy)}>Confirm booking</Btn>
    </div>
  );
}

/* ------------------------------ Maintenance ------------------------------ */

const MAINT_FLOW = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];

function Maintenance(ctx) {
  const { assets, setAssets, maintenance, setMaintenance, employees, addLog, notify, user } = ctx;
  const [modal, setModal] = useState(false);
  const canApprove = ["Admin", "Asset Manager"].includes(user.role);

  function advance(m, next) {
    setMaintenance(maintenance.map((x) => x.id === m.id ? { ...x, status: next } : x));
    const asset = assets.find((a) => a.id === m.assetId);
    if (next === "Approved") {
      setAssets(assets.map((a) => a.id === m.assetId ? { ...a, status: "Under Maintenance", history: [...a.history, { type: "maintenance", detail: "Maintenance approved", date: iso(today) }] } : a));
      notify("Maintenance Approved", `${asset.tag} moved to Under Maintenance`);
    }
    if (next === "Rejected") {
      notify("Maintenance Rejected", `Request for ${asset.tag} was rejected`);
    }
    if (next === "Resolved") {
      setAssets(assets.map((a) => a.id === m.assetId ? { ...a, status: "Available", history: [...a.history, { type: "maintenance", detail: "Maintenance resolved", date: iso(today) }] } : a));
      notify("Maintenance Resolved", `${asset.tag} is Available again`);
    }
    addLog(`Maintenance ${m.id} → ${next}`);
  }

  return (
    <div>
      <SectionHeader eyebrow="Approval-gated repairs" title="Maintenance Management" action={<Btn icon={Plus} onClick={() => setModal(true)}>Raise Request</Btn>} />
      <div className="space-y-3">
        {maintenance.map((m) => {
          const asset = assets.find((a) => a.id === m.assetId);
          const idx = MAINT_FLOW.indexOf(m.status);
          return (
            <Card key={m.id} className="p-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <TagChip>{asset.tag}</TagChip>
                    <span className="font-medium" style={{ color: COLORS.ink }}>{asset.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: m.priority === "High" ? COLORS.rustSoft : COLORS.slateSoft, color: m.priority === "High" ? COLORS.rust : COLORS.slate }}>{m.priority} priority</span>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.slate }}>{m.issue}</p>
                  <p className="text-xs mt-1" style={{ color: COLORS.slate }}>Raised by {employees.find((e) => e.id === m.raisedBy)?.name} · {m.date}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>

              {m.status !== "Rejected" && (
                <div className="flex items-center gap-1 mt-4">
                  {MAINT_FLOW.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: i <= idx ? COLORS.teal : COLORS.slate }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: i <= idx ? COLORS.teal : COLORS.line }}>
                          {i <= idx && <Check size={10} color="#fff" />}
                        </div>
                        {step}
                      </div>
                      {i < MAINT_FLOW.length - 1 && <div className="w-6 h-px" style={{ background: i < idx ? COLORS.teal : COLORS.line }} />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {canApprove && (
                <div className="flex gap-2 mt-4">
                  {m.status === "Pending" && (
                    <>
                      <Btn size="sm" onClick={() => advance(m, "Approved")}>Approve</Btn>
                      <Btn size="sm" variant="danger" onClick={() => advance(m, "Rejected")}>Reject</Btn>
                    </>
                  )}
                  {m.status === "Approved" && <Btn size="sm" onClick={() => advance(m, "Technician Assigned")}>Assign Technician</Btn>}
                  {m.status === "Technician Assigned" && <Btn size="sm" onClick={() => advance(m, "In Progress")}>Start Work</Btn>}
                  {m.status === "In Progress" && <Btn size="sm" onClick={() => advance(m, "Resolved")}>Mark Resolved</Btn>}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {modal && (
        <RaiseMaintenanceModal assets={assets} employees={employees}
          onClose={() => setModal(false)}
          onSave={(m) => { setMaintenance([...maintenance, { ...m, id: "m" + (maintenance.length + 1), status: "Pending", technician: null, date: iso(today) }]); addLog(`Raised maintenance request for ${assets.find((a) => a.id === m.assetId)?.tag}`); setModal(false); }} />
      )}
    </div>
  );
}

function RaiseMaintenanceModal({ assets, employees, onClose, onSave }) {
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [raisedBy, setRaisedBy] = useState(employees[0]?.id || "");
  return (
    <Modal title="Raise Maintenance Request" onClose={onClose}>
      <Field label="Asset">
        <select style={inputStyle} value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.tag} — {a.name}</option>)}
        </select>
      </Field>
      <Field label="Describe the issue"><textarea style={{ ...inputStyle, minHeight: 80 }} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="What's wrong with the asset?" /></Field>
      <Field label="Priority">
        <select style={inputStyle} value={priority} onChange={(e) => setPriority(e.target.value)}>
          {["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Raised by">
        <select style={inputStyle} value={raisedBy} onChange={(e) => setRaisedBy(e.target.value)}>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>
      <Btn onClick={() => assetId && issue && onSave({ assetId, issue, priority, raisedBy })}>Submit request</Btn>
    </Modal>
  );
}

/* ------------------------------ Asset Audit ------------------------------ */

function Audit(ctx) {
  const { audits, setAudits, assets, setAssets, employees, addLog, notify } = ctx;
  const [modal, setModal] = useState(false);
  const [active, setActive] = useState(null);

  function markItem(cycle, assetId, result) {
    const items = cycle.items.filter((i) => i.assetId !== assetId).concat([{ assetId, result }]);
    setAudits(audits.map((a) => a.id === cycle.id ? { ...a, items } : a));
  }

  function closeCycle(cycle) {
    const flagged = cycle.items.filter((i) => i.result !== "Verified");
    setAssets(assets.map((a) => {
      const item = cycle.items.find((i) => i.assetId === a.id);
      if (item && item.result === "Missing") return { ...a, status: "Lost", history: [...a.history, { type: "audit", detail: `Marked missing in ${cycle.name}`, date: iso(today) }] };
      if (item && item.result === "Damaged") return { ...a, history: [...a.history, { type: "audit", detail: `Marked damaged in ${cycle.name}`, date: iso(today) }] };
      return a;
    }));
    setAudits(audits.map((a) => a.id === cycle.id ? { ...a, status: "Closed" } : a));
    addLog(`Closed audit cycle ${cycle.name} — ${flagged.length} discrepancies`);
    if (flagged.length) notify("Audit Discrepancy Flagged", `${flagged.length} item(s) flagged in ${cycle.name}`);
    setActive(null);
  }

  return (
    <div>
      <SectionHeader eyebrow="Structured verification" title="Asset Audit" action={<Btn icon={Plus} onClick={() => setModal(true)}>New Audit Cycle</Btn>} />
      <div className="grid md:grid-cols-2 gap-4">
        {audits.map((cycle) => (
          <Card key={cycle.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONT_DISPLAY }}>{cycle.name}</span>
              <StatusBadge status={cycle.status} />
            </div>
            <div className="text-xs mb-3" style={{ color: COLORS.slate }}>
              Scope: {cycle.scope} · {cycle.dateStart} → {cycle.dateEnd}<br />
              Auditors: {cycle.auditors.map((id) => employees.find((e) => e.id === id)?.name).join(", ")}
            </div>
            <div className="flex gap-2">
              <Btn size="sm" variant="outline" onClick={() => setActive(cycle)}>Open cycle</Btn>
              {cycle.status !== "Closed" && cycle.items.length > 0 && <Btn size="sm" onClick={() => closeCycle(cycle)}>Close cycle</Btn>}
            </div>
            {cycle.items.filter((i) => i.result !== "Verified").length > 0 && (
              <div className="mt-3 text-xs px-2 py-1.5 rounded-md" style={{ background: COLORS.rustSoft, color: COLORS.rust }}>
                {cycle.items.filter((i) => i.result !== "Verified").length} discrepancy report item(s)
              </div>
            )}
          </Card>
        ))}
      </div>

      {active && (
        <Modal title={active.name} onClose={() => setActive(null)} wide>
          <p className="text-sm mb-4" style={{ color: COLORS.slate }}>Mark each in-scope asset as Verified, Missing, or Damaged.</p>
          <div className="space-y-2">
            {assets.map((a) => {
              const item = active.items.find((i) => i.assetId === a.id);
              return (
                <div key={a.id} className="flex items-center justify-between p-2.5 rounded-md" style={{ background: COLORS.paper }}>
                  <div className="flex items-center gap-2"><TagChip>{a.tag}</TagChip><span className="text-sm">{a.name}</span></div>
                  <div className="flex gap-1">
                    {["Verified", "Missing", "Damaged"].map((r) => (
                      <button key={r} onClick={() => markItem(active, a.id, r)}
                        className="text-xs px-2 py-1 rounded-md"
                        style={{
                          background: item?.result === r ? STATUS_COLORS[r] : "#fff",
                          color: item?.result === r ? "#fff" : COLORS.slate,
                          border: `1px solid ${item?.result === r ? STATUS_COLORS[r] : COLORS.line}`,
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {modal && (
        <NewAuditModal employees={employees} onClose={() => setModal(false)}
          onSave={(a) => { setAudits([...audits, { ...a, id: "ac" + (audits.length + 1), status: "Scheduled", items: [] }]); addLog(`Created audit cycle ${a.name}`); setModal(false); }} />
      )}
    </div>
  );
}

function NewAuditModal({ employees, onClose, onSave }) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState("");
  const [dateStart, setDateStart] = useState(iso(today));
  const [dateEnd, setDateEnd] = useState(iso(addDays(today, 7)));
  const [auditors, setAuditors] = useState([]);
  return (
    <Modal title="New Audit Cycle" onClose={onClose}>
      <Field label="Cycle name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AC-04 Q3 Review" /></Field>
      <Field label="Scope (department / location)"><input style={inputStyle} value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g. HQ Floor 3" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date"><input type="date" style={inputStyle} value={dateStart} onChange={(e) => setDateStart(e.target.value)} /></Field>
        <Field label="End date"><input type="date" style={inputStyle} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} /></Field>
      </div>
      <Field label="Assign auditors">
        <div className="flex flex-wrap gap-1.5">
          {employees.map((e) => (
            <button key={e.id} type="button" onClick={() => setAuditors(auditors.includes(e.id) ? auditors.filter((x) => x !== e.id) : [...auditors, e.id])}
              className="text-xs px-2 py-1 rounded-md"
              style={{ background: auditors.includes(e.id) ? COLORS.ink : "#fff", color: auditors.includes(e.id) ? "#fff" : COLORS.slate, border: `1px solid ${COLORS.line}` }}>
              {e.name}
            </button>
          ))}
        </div>
      </Field>
      <Btn onClick={() => name && scope && onSave({ name, scope, dateStart, dateEnd, auditors })}>Create cycle</Btn>
    </Modal>
  );
}

/* ------------------------------ Reports ------------------------------ */

function Reports(ctx) {
  const { assets, maintenance, bookings, departments, employees, categories } = ctx;
  const utilization = categories.map((c) => {
    const catAssets = assets.filter((a) => a.categoryId === c.id);
    const active = catAssets.filter((a) => a.status === "Allocated" || a.status === "Reserved").length;
    return { name: c.name, total: catAssets.length, active };
  });
  const maintByCat = categories.map((c) => ({
    name: c.name,
    count: maintenance.filter((m) => assets.find((a) => a.id === m.assetId)?.categoryId === c.id).length,
  }));
  const deptAlloc = departments.map((d) => ({
    name: d.name,
    count: assets.filter((a) => employees.find((e) => e.id === a.holderId)?.deptId === d.id).length,
  }));
  const nearRetirement = assets.filter((a) => new Date(a.acquisitionDate) < new Date("2021-06-01"));

  return (
    <div>
      <SectionHeader eyebrow="Operational insight" title="Reports & Analytics" action={<Btn variant="outline" icon={FileText}>Export report</Btn>} />
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}>Asset utilization by category</h3>
          <div className="space-y-3">
            {utilization.map((u) => (
              <div key={u.name}>
                <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.slate }}><span>{u.name}</span><span>{u.active}/{u.total} in use</span></div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: COLORS.slateSoft }}>
                  <div className="h-full rounded-full" style={{ width: `${u.total ? (u.active / u.total) * 100 : 0}%`, background: COLORS.teal }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}>Maintenance frequency by category</h3>
          <div className="space-y-3">
            {maintByCat.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-xs w-28 shrink-0" style={{ color: COLORS.slate }}>{m.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: COLORS.slateSoft }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(m.count * 30, 100)}%`, background: COLORS.rust }} />
                </div>
                <span className="text-xs" style={{ fontFamily: FONT_MONO, color: COLORS.ink }}>{m.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}>Department-wise allocation</h3>
          <div className="space-y-2">
            {deptAlloc.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm p-2 rounded-md" style={{ background: COLORS.paper }}>
                <span style={{ color: COLORS.ink }}>{d.name}</span>
                <TagChip tone="paper">{d.count} assets</TagChip>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}>Nearing retirement</h3>
          {nearRetirement.length === 0 ? <EmptyState icon={ShieldCheck} title="Nothing flagged" /> : (
            <div className="space-y-2">
              {nearRetirement.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm p-2 rounded-md" style={{ background: COLORS.paper }}>
                  <div className="flex items-center gap-2"><TagChip>{a.tag}</TagChip>{a.name}</div>
                  <span className="text-xs" style={{ color: COLORS.slate }}>acquired {a.acquisitionDate}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------ Activity Logs & Notifications ------------------------------ */

function Logs(ctx) {
  const { logs, notifications, setNotifications } = ctx;
  const [tab, setTab] = useState("notif");
  return (
    <div>
      <SectionHeader eyebrow="Stay informed" title="Activity & Notifications" />
      <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: COLORS.slateSoft }}>
        {[["notif", "Notifications"], ["logs", "Activity Log"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className="px-4 py-2 text-sm rounded-md font-medium"
            style={{ background: tab === id ? COLORS.card : "transparent", color: tab === id ? COLORS.ink : COLORS.slate }}>{label}</button>
        ))}
      </div>
      {tab === "notif" && (
        <Card>
          {notifications.map((n) => (
            <div key={n.id} onClick={() => setNotifications(notifications.map((x) => x.id === n.id ? { ...x, read: true } : x))}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer" style={{ borderBottom: `1px solid ${COLORS.line}`, background: n.read ? "transparent" : COLORS.tealSoft }}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.read ? COLORS.line : COLORS.teal }} />
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: COLORS.ink }}>{n.type}</div>
                <div className="text-sm" style={{ color: COLORS.slate }}>{n.message}</div>
              </div>
              <div className="text-xs shrink-0" style={{ color: COLORS.slate }}>{n.time}</div>
            </div>
          ))}
        </Card>
      )}
      {tab === "logs" && (
        <Card>
          {logs.map((l) => (
            <div key={l.id} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
              <div className="text-sm"><span className="font-medium" style={{ color: COLORS.ink }}>{l.actor}</span> <span style={{ color: COLORS.slate }}>{l.action}</span></div>
              <div className="text-xs" style={{ color: COLORS.slate, fontFamily: FONT_MONO }}>{l.time}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ------------------------------ App ------------------------------ */

export default function App() {
  useFonts();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");

  const [departments, setDepartments] = useState(seedDepartments);
  const [categories, setCategories] = useState(seedCategories);
  const [employees, setEmployees] = useState(seedEmployees);
  const [assets, setAssets] = useState(seedAssets);
  const [bookings, setBookings] = useState(seedBookings);
  const [maintenance, setMaintenance] = useState(seedMaintenance);
  const [audits, setAudits] = useState(seedAudits);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [logs, setLogs] = useState(seedLogs);

  function addLog(action) {
    setLogs((l) => [{ id: "l" + (l.length + 1), actor: user?.name || "System", action, time: new Date().toISOString().slice(0, 16).replace("T", " ") }, ...l]);
  }
  function notify(type, message) {
    setNotifications((n) => [{ id: "n" + (n.length + 1), type, message, time: "just now", read: false }, ...n]);
  }

  if (!user) {
    return (
      <AuthScreen
        employees={employees}
        onLogin={(emp) => setUser(emp)}
        onSignup={(f) => {
          const newEmp = { id: "e" + (employees.length + 1), name: f.name, email: f.email, deptId: f.deptId, role: "Employee", status: "Active" };
          setEmployees([...employees, newEmp]);
          setUser(newEmp);
        }}
      />
    );
  }

  const ctx = {
    user, departments, setDepartments, categories, setCategories, employees, setEmployees,
    assets, setAssets, bookings, setBookings, maintenance, setMaintenance, audits, setAudits,
    notifications, setNotifications, logs, setLogs, search, addLog, notify,
  };

  const pages = {
    dashboard: <Dashboard ctx={ctx} setPage={setPage} />,
    org: <OrgSetup {...ctx} />,
    assets: <AssetDirectory {...ctx} />,
    allocation: <Allocation {...ctx} />,
    booking: <Booking {...ctx} />,
    maintenance: <Maintenance {...ctx} />,
    audit: <Audit {...ctx} />,
    reports: <Reports {...ctx} />,
    logs: <Logs {...ctx} />,
  };

  const allowedPage = NAV.find((n) => n.id === page)?.roles.includes(user.role) ? page : "dashboard";

  return (
    <div className="flex" style={{ background: COLORS.paper, minHeight: "100vh", fontFamily: FONT_BODY }}>
      <Sidebar page={allowedPage} setPage={setPage} user={user} onLogout={() => setUser(null)} />
      <div className="flex-1 min-w-0">
        <Topbar user={user} notifications={notifications} search={search} setSearch={setSearch} />
        <div className="p-8">{pages[allowedPage]}</div>
      </div>
    </div>
  );
}
