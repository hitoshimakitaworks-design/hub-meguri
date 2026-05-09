'use client'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useSearch } from '@/lib/searchContext'
import { Sidebar } from '@/components/Sidebar'
import { ToolTile } from '@/components/ToolTile'
import { ToolModal } from '@/components/ToolModal'
import { getCategoryGradient, type Tool } from '@/lib/toolMaps'

const SKIP_KEY = 'meguri_skip_modal_tools'

export default function Home() {
  const { t } = useI18n()
  const { query } = useSearch()
  const [active, setActive] = useState<string>('home')
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [scrollY, setScrollY] = useState(0)

  // スクロール位置を rAF 抑制で取得（バナーフェード用）
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // タイルタップハンドラ：ツールが skip 登録されていれば直接開く
  const handleSelectTool = (tool: Tool) => {
    if (typeof window === 'undefined') {
      setSelectedTool(tool)
      return
    }
    try {
      const skip: string[] = JSON.parse(localStorage.getItem(SKIP_KEY) || '[]')
      if (skip.includes(tool.url)) {
        window.open(tool.url, '_blank', 'noopener,noreferrer')
        return
      }
    } catch {
      // localStorage パース失敗は無視してモーダル表示
    }
    setSelectedTool(tool)
  }

  // カテゴリ一覧（言語非依存のグラデーション色割当に使用）
  const categories = useMemo(
    () => Array.from(new Set(t.tools.map(tool => tool.category))),
    [t.tools],
  )

  // 検索フィルタ
  const searchFiltered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return t.tools.filter(
      tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q),
    )
  }, [query, t.tools])

  // セクションデータ
  const featured = t.tools.filter(tool => tool.featured)
  const newest = [...t.tools].slice(-4).reverse()
  const byCategory = useMemo(() => {
    const map: Record<string, Tool[]> = {}
    for (const cat of categories) {
      map[cat] = t.tools.filter(tool => tool.category === cat)
    }
    return map
  }, [categories, t.tools])

  // active によるセクション表示制御
  const showSection = (id: string): boolean => {
    if (searchFiltered) return false
    if (active === 'home') return true
    if (active === 'new' && id === 'new') return true
    if (active === 'popular' && id === 'featured') return true
    if (active === id) return true
    return false
  }

  // バナーのフェード進捗（0-1）
  const fadeProgress = Math.min(1, scrollY / 200)
  const showBanner = !searchFiltered && active === 'home'

  return (
    <>
      <Sidebar active={active} onSelect={setActive} />

      <main className="md:pl-14 min-h-[calc(100vh-3.5rem)]">
        {/* フルブリードヒーローバナー（PC・モバイル共通） */}
        {showBanner && (
          <div
            className="relative overflow-hidden shadow-md"
            style={{
              background:
                'radial-gradient(ellipse at center, #1e40af 0%, #1e40af 13%, #2563eb 47%, #5eead4 78%, #67e8f9 100%)',
              opacity: 1 - fadeProgress,
              transform: `scale(${1 - fadeProgress * 0.04})`,
              transformOrigin: 'top center',
              willChange: 'opacity, transform',
            }}
          >
            <div className="max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-11">
              <h1
                className="text-white text-2xl sm:text-3xl md:text-[2.4rem] font-extrabold leading-tight tracking-tight"
                style={{
                  textShadow:
                    '0 0 10px rgba(15, 23, 42, 0.55), 0 1px 2px rgba(15, 23, 42, 0.7), 0 2px 8px rgba(30, 58, 138, 0.55), 0 0 22px rgba(30, 58, 138, 0.3)',
                }}
              >
                {t.heroTitle}
              </h1>
              <p
                className="text-white text-xs sm:text-sm md:text-base mt-2 md:mt-3 max-w-2xl leading-relaxed font-medium"
                style={{
                  textShadow:
                    '0 0 8px rgba(15, 23, 42, 0.6), 0 1px 2px rgba(15, 23, 42, 0.75), 0 1px 6px rgba(30, 58, 138, 0.5)',
                }}
              >
                {t.heroDesc}
              </p>
            </div>
          </div>
        )}

        {/* セクション本体（既存の幅制限維持） */}
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 md:pt-5">
          {searchFiltered ? (
            <SearchResults
              title={t.searchResultsTitle}
              tools={searchFiltered}
              categories={categories}
              noResults={t.noResults}
              onSelect={handleSelectTool}
            />
          ) : (
            <>
              {showSection('featured') && featured.length > 0 && (
                <Section
                  title={t.sectionFeatured}
                  tools={featured}
                  categories={categories}
                  onSelect={handleSelectTool}
                />
              )}

              {showSection('new') && (
                <Section
                  title={t.sectionNew}
                  tools={newest}
                  categories={categories}
                  onSelect={handleSelectTool}
                />
              )}

              {/* カテゴリ別 */}
              {categories.map(cat =>
                showSection(cat) ? (
                  <Section
                    key={cat}
                    title={cat}
                    tools={byCategory[cat]}
                    categories={categories}
                    onSelect={handleSelectTool}
                  />
                ) : null,
              )}
            </>
          )}
        </div>
      </main>

      {/* ツール詳細モーダル */}
      <ToolModal
        tool={selectedTool}
        gradient={
          selectedTool
            ? getCategoryGradient(selectedTool.category, categories)
            : ''
        }
        onClose={() => setSelectedTool(null)}
        skipKey={SKIP_KEY}
      />
    </>
  )
}

// ───────── セクションコンポーネント ─────────

type SectionProps = {
  title: string
  tools: Tool[]
  categories: string[]
  onSelect: (tool: Tool) => void
}

function Section({ title, tools, categories, onSelect }: SectionProps) {
  if (tools.length === 0) return null
  return (
    <section className="mb-8">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3">{title}</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tools.map(tool => (
          <ToolTile
            key={tool.url}
            tool={tool}
            gradient={getCategoryGradient(tool.category, categories)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

// ───────── 検索結果 ─────────

type SearchResultsProps = {
  title: string
  tools: Tool[]
  categories: string[]
  noResults: string
  onSelect: (tool: Tool) => void
}

function SearchResults({ title, tools, categories, noResults, onSelect }: SearchResultsProps) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3">{title}</h2>
      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={36} className="text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">{noResults}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tools.map(tool => (
            <ToolTile
              key={tool.url}
              tool={tool}
              gradient={getCategoryGradient(tool.category, categories)}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}
