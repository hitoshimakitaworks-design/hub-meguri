'use client'
import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { TOOL_ICON, BADGE_COLORS, type Tool } from '@/lib/toolMaps'
import { useI18n } from '@/lib/i18n'

type Props = {
  tool: Tool | null
  gradient: string
  onClose: () => void
  skipKey: string
}

function getScreenshotUrl(appUrl: string): string {
  const params = new URLSearchParams({
    url: appUrl,
    screenshot: 'true',
    meta: 'false',
    'viewport.width': '1280',
    'viewport.height': '720',
  })
  return `https://api.microlink.io/?${params.toString()}`
}

export function ToolModal({ tool, gradient, onClose, skipKey }: Props) {
  const { lang } = useI18n()
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [skipNext, setSkipNext] = useState(false)

  // モーダル開閉ごとにチェック状態をリセット
  useEffect(() => {
    if (tool) setSkipNext(false)
  }, [tool])

  // body スクロールロック + ESC キー閉じる
  useEffect(() => {
    if (!tool) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [tool, onClose])

  // スクリーンショット取得
  useEffect(() => {
    if (!tool) {
      setImgUrl(null)
      return
    }
    let cancelled = false
    const apiUrl = getScreenshotUrl(tool.url)
    fetch(apiUrl)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        const url = data?.data?.screenshot?.url
        if (url) setImgUrl(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [tool])

  if (!tool) return null

  const Icon = TOOL_ICON[tool.icon] ?? ExternalLink
  const badgeColor = BADGE_COLORS[tool.badge]
  const ctaText = lang === 'ja' ? '今すぐ使う' : 'Use now'
  const skipLabel =
    lang === 'ja'
      ? `次回から「${tool.name}」を直接開く`
      : `Open "${tool.name}" directly next time`

  // 「今すぐ使う」クリック時：チェックされていれば skip 登録
  const handleUseClick = () => {
    if (!skipNext) return
    try {
      const skip: string[] = JSON.parse(localStorage.getItem(skipKey) || '[]')
      if (!skip.includes(tool.url)) {
        localStorage.setItem(skipKey, JSON.stringify([...skip, tool.url]))
      }
    } catch {
      // localStorage 失敗時は静かに無視
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden
                   max-h-[92vh] sm:max-h-[88vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* スクリーンショット領域 */}
        <div
          className={`relative aspect-[16/9] bg-gradient-to-br ${gradient} flex-shrink-0`}
        >
          {imgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={tool.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon size={64} className="text-white/95 drop-shadow-lg" strokeWidth={1.6} />
            </div>
          )}
          {tool.badge && badgeColor && (
            <span
              className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-extrabold px-2 py-1 rounded uppercase tracking-wide shadow-md`}
            >
              {tool.badge}
            </span>
          )}
        </div>

        {/* 詳細コンテンツ */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {tool.category}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-3">
            {tool.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            {tool.desc}
          </p>

          {/* 「次回から直接開く」チェックボックス */}
          <label className="flex items-start gap-2 text-xs text-gray-500 mb-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={skipNext}
              onChange={e => setSkipNext(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 accent-blue-600 cursor-pointer flex-shrink-0"
            />
            <span className="leading-snug">{skipLabel}</span>
          </label>

          {/* CTA */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleUseClick}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700
                       text-white font-bold text-base py-3 rounded-xl shadow-md transition-colors
                       min-h-[48px]"
          >
            {ctaText}
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
