export type ApplicationStage = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface TrackedApplication {
  id: string;
  jobId?: string;
  company: string;
  title: string;
  location?: string;
  salaryText?: string;
  applyUrl?: string;
  stage: ApplicationStage;
  notes?: string;
  appliedAt?: string;
  followUpAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const STAGE_CONFIG: Record<
  ApplicationStage,
  { label: string; color: string; badgeBg: string; borderColor: string; description: string }
> = {
  saved: {
    label: "Saved Roles",
    color: "text-slate-700",
    badgeBg: "bg-slate-100 text-slate-800",
    borderColor: "border-slate-300",
    description: "Roles to review and tailor applications for.",
  },
  applied: {
    label: "Applied",
    color: "text-blue-700",
    badgeBg: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-400",
    description: "Submitted applications awaiting response.",
  },
  interview: {
    label: "Interviewing",
    color: "text-purple-700",
    badgeBg: "bg-purple-100 text-purple-800",
    borderColor: "border-purple-400",
    description: "Active screening calls, tech rounds & team interviews.",
  },
  offer: {
    label: "Offer Received",
    color: "text-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-800",
    borderColor: "border-emerald-400",
    description: "Official job offer received & under negotiation.",
  },
  rejected: {
    label: "Archived",
    color: "text-gray-500",
    badgeBg: "bg-gray-100 text-gray-700",
    borderColor: "border-gray-300",
    description: "Roles closed or not moving forward.",
  },
};

export const KANBAN_STAGES: Array<{ id: ApplicationStage; label: string; badgeColor: string }> = [
  { id: "saved", label: "Saved", badgeColor: "bg-blue-500" },
  { id: "applied", label: "Applied", badgeColor: "bg-indigo-500" },
  { id: "interview", label: "Interview", badgeColor: "bg-amber-500" },
  { id: "offer", label: "Offer", badgeColor: "bg-emerald-500" },
  { id: "rejected", label: "Rejected", badgeColor: "bg-slate-500" },
];
