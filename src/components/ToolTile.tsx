'use client'
import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { TOOL_ICON, BADGE_COLORS, type Tool } from '@/lib/toolMaps'

type Props = {
  tool: Tool
  gradient: string
  onSelect?: (tool: Tool) => void
}

// Microlink の JSON API でスクリーンショット URL を取得
async function fetchScreenshotUrl(appUrl: string): Promise<string | null> {
  const apiUrl =
    `https://api.microlink.io/?url=${encodeURIComponent(appUrl)}` +
    `&screenshot=true&meta=false&viewport.width=1280&viewport.height=720`
  try {
    const res = await fetch(apiUrl)
    if (!res.ok) return null
    const data = await res.json()
    return data?.data?.screenshot?.url ?? null
  } catch {
    return null
  }
}

export function ToolTile({ tool, gradient, onSelect }: Props) {
  const Icon = TOOL_ICON[tool.icon] ?? ExternalLink
  const badgeColor = BADGE_COLORS[tool.badge]
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchScreenshotUrl(tool.url).then(url => {
      if (cancelled) return
      if (url) setScreenshotUrl(url)
      else setImgError(true)
    })
    return () => {
      cancelled = true
    }
  }, [tool.url])

  // タイル本体（クリック要素の中に入る共通 JSX）
  const tileContent = (
    <div
      className={`relative aspect-[16/9] rounded-xl overflow-hidden shadow-md
                  group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-200
                  bg-gradient-to-br ${gradient}`}
    >
      {/* スクリーンショット */}
      {screenshotUrl && !imgError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={screenshotUrl}
          alt={tool.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top
                      transition-all duration-300
                      group-hover:scale-105
                      ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* フォールバック装飾 */}
      {!imgLoaded && (
        <>
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 blur-lg pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              size={56}
              className="text-white/95 drop-shadow-lg"
              strokeWidth={1.8}
            />
          </div>
        </>
      )}

      {/* バッジ（左上） */}
      {tool.badge && badgeColor && (
        <span
          className={`absolute top-2.5 left-2.5 ${badgeColor} text-white text-[11px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide shadow-md z-10`}
        >
          {tool.badge}
        </span>
      )}

      {/* アプリ名オーバーレイ（モバイルではコンパクト） */}
      <div className="absolute bottom-0 inset-x-0 px-2.5 sm:px-4 pt-4 sm:pt-8 pb-2 sm:pb-3 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10">
        <h3 className="text-white text-xs sm:text-base md:text-lg font-extrabold leading-tight drop-shadow-md tracking-tight line-clamp-2">
          {tool.name}
        </h3>
        <p className="text-white/80 text-xs md:text-xs mt-0.5 line-clamp-1">
          {tool.category}
        </p>
      </div>
    </div>
  )

  // onSelect があればボタン化（モーダル表示） / なければ直接リンク
  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(tool)}
        className="group block w-full text-left"
        title={tool.desc}
      >
        {tileContent}
      </button>
    )
  }

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      title={tool.desc}
    >
      {tileContent}
    </a>
  )
}
