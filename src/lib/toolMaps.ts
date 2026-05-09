import {
  FileText,
  Calendar,
  Hash,
  Wrench,
  BookOpen,
  Heart,
  Palette,
  Briefcase,
  Share2,
  Timer,
  Users,
  GraduationCap,
  Sparkles,
  Download,
  Gauge,
  Fuel,
  MapPin,
  Moon,
  ImageDown,
  Shuffle,
  type LucideIcon,
} from 'lucide-react'

// 共通の Tool 型（messages/ja.ts, en.ts と一致）
export type Tool = {
  name: string
  desc: string
  category: string
  icon: string
  badge: string
  featured: boolean
  url: string
}

// ツールアイコン名 → lucide コンポーネント
export const TOOL_ICON: Record<string, LucideIcon> = {
  FileText,
  Calendar,
  Hash,
  Wrench,
  BookOpen,
  Heart,
  Palette,
  Briefcase,
  Share2,
  Timer,
  Users,
  GraduationCap,
  Download,
  Gauge,
  Fuel,
  MapPin,
  Moon,
  ImageDown,
  Shuffle,
}

// カテゴリ名 → サイドバー用アイコン（日英の名前を網羅）
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  ビジネス: Briefcase,
  Business: Briefcase,
  SNS: Share2,
  Social: Share2,
  学習: BookOpen,
  Learning: BookOpen,
  生活: Heart,
  Lifestyle: Heart,
  ライフスタイル: Heart,
  生活実用: Sparkles,
  Daily: Sparkles,
  クリエイティブ: Palette,
  Creative: Palette,
}

// カテゴリ → グラデーション（ツールタイル用）
// 発見順に PALETTE を割当（言語非依存）
const PALETTE = [
  'from-blue-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
]

export function getCategoryGradient(category: string, allCategories: string[]): string {
  const idx = allCategories.indexOf(category)
  return PALETTE[idx % PALETTE.length]
}

// バッジ色
export const BADGE_COLORS: Record<string, string> = {
  Hot: 'bg-red-500',
  New: 'bg-blue-500',
  Top: 'bg-yellow-500',
}
