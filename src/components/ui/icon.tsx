import {
  Globe, Database, Users, Sparkles, PlaySquare, Megaphone, Instagram, Box, Music2, Captions, Wand2, Camera, Image as ImageIcon,
  Video, Hash, Layers, Filter, FileText, PenLine, FolderOpen, ClipboardCheck, BarChart3, Cloud, UserCog, PieChart, Zap,
  Eye, Search, Pencil, Code2, Monitor, Target, ShoppingCart, Settings, Gauge, ShieldCheck, Lock, CreditCard, Plug,
  LayoutDashboard, Lightbulb, Star, Handshake, Rocket, Mail, Phone, MapPin, Clock, MessageCircle, Calendar, Headphones,
  Diamond, TrendingUp, Gem, Scissors, Upload, Send, Crown, Package, CheckCircle2, Heart, Award, Smartphone, Bot,
  Workflow, Bell, Receipt, Briefcase, LineChart, Building2, Globe2, Palette, Film, Type, Wallet, Shield, Repeat, Timer, Coins,
  Youtube, Linkedin, Facebook,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  globe: Globe, database: Database, users: Users, sparkles: Sparkles, play: PlaySquare, megaphone: Megaphone,
  instagram: Instagram, box: Box, music: Music2, captions: Captions, wand: Wand2, camera: Camera, image: ImageIcon,
  video: Video, hash: Hash, layers: Layers, filter: Filter, file: FileText, pen: PenLine, folder: FolderOpen,
  clipboard: ClipboardCheck, bars: BarChart3, cloud: Cloud, usercog: UserCog, pie: PieChart, zap: Zap, eye: Eye,
  search: Search, pencil: Pencil, code: Code2, monitor: Monitor, target: Target, cart: ShoppingCart, settings: Settings,
  gauge: Gauge, shield: ShieldCheck, lock: Lock, card: CreditCard, plug: Plug, dashboard: LayoutDashboard, bulb: Lightbulb,
  star: Star, handshake: Handshake, rocket: Rocket, mail: Mail, phone: Phone, pin: MapPin, clock: Clock, chat: MessageCircle,
  calendar: Calendar, headphones: Headphones, diamond: Diamond, trending: TrendingUp, gem: Gem, scissors: Scissors,
  upload: Upload, send: Send, crown: Crown, package: Package, check: CheckCircle2, heart: Heart, award: Award,
  smartphone: Smartphone, bot: Bot, workflow: Workflow, bell: Bell, receipt: Receipt, briefcase: Briefcase, linechart: LineChart,
  building: Building2, world: Globe2, palette: Palette, film: Film, type: Type, wallet: Wallet, shieldplain: Shield,
  repeat: Repeat, timer: Timer, coins: Coins, youtube: Youtube, linkedin: Linkedin, facebook: Facebook,
};

export type IconName = keyof typeof icons;

export const tileColors = {
  blue: "bg-blue-50 text-brand-blue",
  purple: "bg-purple-50 text-purple-600",
  pink: "bg-pink-50 text-pink-600",
  red: "bg-rose-50 text-rose-500",
  green: "bg-emerald-50 text-emerald-500",
  orange: "bg-amber-50 text-amber-500",
  cyan: "bg-cyan-50 text-cyan-600",
  violet: "bg-violet-50 text-violet-600",
} as const;
export type TileColor = keyof typeof tileColors;

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = icons[name] ?? Sparkles;
  return <C className={cn("h-6 w-6", className)} strokeWidth={1.8} />;
}

export function IconTile({ name, color = "blue", size = "md", round = false }: { name: string; color?: TileColor; size?: "sm" | "md" | "lg"; round?: boolean }) {
  const s = size === "sm" ? "h-11 w-11" : size === "lg" ? "h-16 w-16" : "h-14 w-14";
  return (
    <div className={cn("flex shrink-0 items-center justify-center", round ? "rounded-full" : "rounded-2xl", s, tileColors[color])}>
      <Icon name={name} className={size === "lg" ? "h-7 w-7" : size === "sm" ? "h-5 w-5" : "h-6 w-6"} />
    </div>
  );
}
