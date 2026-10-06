import {
  ArrowDownUp,
  BarChart3,
  Droplets,
  Flag,
  Gamepad2,
  GitBranch,
  Grid2x2,
  Grid3x3,
  Heart,
  HelpCircle,
  MapPinned,
  Network,
  Route,
  Timer,
  TrendingUp,
  Waves,
  type LucideIcon,
} from 'lucide-react';

export const VIZ_ICON: Record<string, LucideIcon> = {
  renditja: BarChart3,
  'gara-e-krahasimeve': Timer,
  kompleksiteti: TrendingUp,
  'gjej-algoritmin': Gamepad2,
  grafet: Network,
  labirinti: Grid3x3,
  'scc-topologjike': GitBranch,
  rruget: MapPinned,
  'kuizi-bellman-ford': HelpCircle,
  'floyd-warshall': Grid2x2,
  'gara-e-rrugeve': Flag,
  'rrjedha-max': Droplets,
  ciftezimi: Heart,
};

export const BLOCK_ICON: Record<string, LucideIcon> = {
  renditja: ArrowDownUp,
  grafet: Network,
  rruget: Route,
  rrjedhat: Waves,
};

export const BLOCK_COLOR: Record<string, string> = {
  renditja: 'var(--brand)',
  grafet: 'var(--brand-2)',
  rruget: 'oklch(0.7 0.16 60)',
  rrjedhat: 'var(--brand-3)',
};
