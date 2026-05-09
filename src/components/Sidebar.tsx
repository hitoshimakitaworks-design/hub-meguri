'use client'
import { useMemo } from 'react'
import { Home, Sparkles, TrendingUp, X, Wrench } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useSidebar } from '@/lib/sidebarContext'
import { CATEGORY_ICON } from '@/lib/toolMaps'

type SectionId = 'home' | 'new' | 'popular' | string // categoryName

type Props = {
  active: SectionId
  onSelect: (id: SectionId) => void
}

export function Sidebar({ active, onSelect }: Props) {
  const { t } = useI18n()
  const { isOpen, close } = useSidebar()

  const categories = useMemo(() => {
    return Array.from(new Set(t.tools.map(tool => tool.category)))
  }, [t.tools])

  const handleClick = (id: SectionId) => {
    onSelect(id)
    close()
  }

  return (
    <>
      {/* モバイル時のオーバーレイ */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
        aria-hidden
      />

      <aside
        className={`group fixed top-14 bottom-0 left-0 z-40 bg-white border-r border-gray-200
                    transition-[width,transform] duration-200 ease-out
                    overflow-hidden md:hover:overflow-y-auto
                    w-60 md:w-14 md:hover:w-60
                    md:translate-x-0
                    md:hover:shadow-lg
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* モバイル用：閉じるボタン */}
        <div className="md:hidden flex justify-end p-2 border-b border-gray-100">
          <button
            onClick={close}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            aria-label={t.howToClose}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-2 space-y-0.5">
          <NavItem
            icon={Home}
            label={t.sidebarHome}
            active={active === 'home'}
            onClick={() => handleClick('home')}
          />
          <NavItem
            icon={Sparkles}
            label={t.sidebarNew}
            active={active === 'new'}
            onClick={() => handleClick('new')}
          />
          <NavItem
            icon={TrendingUp}
            label={t.sidebarPopular}
            active={active === 'popular'}
            onClick={() => handleClick('popular')}
          />

          {/* カテゴリ見出し（畳み時はフェードアウト） */}
          <div
            className="pt-5 pb-1.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider
                       whitespace-nowrap transition-opacity duration-150
                       md:opacity-0 md:group-hover:opacity-100"
          >
            {t.sidebarCategoriesLabel}
          </div>

          {categories.map(cat => {
            const Icon = CATEGORY_ICON[cat] ?? Wrench
            return (
              <NavItem
                key={cat}
                icon={Icon}
                label={cat}
                active={active === cat}
                onClick={() => handleClick(cat)}
              />
            )
          })}
        </nav>
      </aside>
    </>
  )
}

// ───────── サブコンポーネント ─────────

type NavItemProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  active: boolean
  onClick: () => void
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors min-h-[40px]
                  ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
      title={label}
    >
      <Icon
        size={18}
        className={`flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-500'}`}
      />
      <span
        className="truncate whitespace-nowrap transition-opacity duration-150
                   md:opacity-0 md:group-hover:opacity-100"
      >
        {label}
      </span>
    </button>
  )
}
