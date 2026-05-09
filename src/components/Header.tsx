'use client'
import { BookOpen, Menu, Search } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useHowTo } from '@/lib/howToContext'
import { useSidebar } from '@/lib/sidebarContext'
import { useSearch } from '@/lib/searchContext'
import { MeguriLogo } from '@/components/MeguriLogo'

export function Header() {
  const { t, lang, toggle } = useI18n()
  const { isOpen, toggle: toggleHowTo } = useHowTo()
  const { toggle: toggleSidebar } = useSidebar()
  const { query, setQuery } = useSearch()

  // PC・モバイルともに HowToDrawer を開閉（モバイルでも全画面 drawer として動作）
  const handleHowTo = () => toggleHowTo()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
      <div className="px-4 h-14 flex items-center gap-3">
        {/* モバイル用ハンバーガー */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 flex-shrink-0"
          aria-label={t.mobileMenuToggle}
        >
          <Menu size={20} />
        </button>

        {/* ロゴ */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <MeguriLogo size={22} />
          <span className="font-brand font-bold text-blue-700 text-2xl md:text-3xl leading-none tracking-tight">
            {t.appName}
          </span>
        </div>

        {/* 検索バー（伸縮・中央寄せ・上限幅で残りスペースは右に） */}
        <div className="flex-1 flex justify-center min-w-0">
          <div className="relative w-full max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-200 bg-gray-50 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white
                         focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* 右端ボタン群 */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          <button
            onClick={handleHowTo}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full border transition-colors min-h-[32px] ${
              isOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            aria-label={t.howToButton}
          >
            <BookOpen size={13} />
            <span className="hidden sm:inline">{t.howToButton}</span>
          </button>
          <button
            onClick={toggle}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>
      </div>
    </header>
  )
}
