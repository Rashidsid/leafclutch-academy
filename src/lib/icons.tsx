import {
  Bot,
  BrainCircuit,
  Briefcase,
  Building2,
  ChartNoAxesCombined,
  Cloud,
  Code,
  Cpu,
  Database,
  FlaskConical,
  Globe,
  GraduationCap,
  Layers,
  MonitorSmartphone,
  Palette,
  PenTool,
  Rocket,
  School,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { createElement } from "react";

/** Icons that admins can choose for courses, categories and programs (stored by key). */
export const ICONS: Record<string, LucideIcon> = {
  bot: Bot,
  sparkles: Sparkles,
  "brain-circuit": BrainCircuit,
  "flask-conical": FlaskConical,
  "chart-no-axes-combined": ChartNoAxesCombined,
  code: Code,
  layers: Layers,
  "monitor-smartphone": MonitorSmartphone,
  server: Server,
  "shield-check": ShieldCheck,
  "pen-tool": PenTool,
  palette: Palette,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  globe: Globe,
  terminal: Terminal,
  smartphone: Smartphone,
  rocket: Rocket,
  briefcase: Briefcase,
  school: School,
  "graduation-cap": GraduationCap,
  "building-2": Building2,
};

export const ICON_OPTIONS = Object.keys(ICONS).map((value) => ({ value, label: value.replace(/-/g, " ") }));

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || Sparkles;
}

/** Renders a registry icon by its stored key. */
export function IconByName({ name, ...props }: { name: string | null | undefined } & Omit<LucideProps, "name">) {
  return createElement(getIcon(name), props);
}
