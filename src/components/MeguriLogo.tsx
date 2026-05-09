export function MeguriLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" fill="#1e40af" />
      <circle cx="12" cy="12" r="6.5" stroke="#2563eb" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="10.5" stroke="#14b8a6" strokeWidth="1" fill="none" opacity="0.65" />
    </svg>
  )
}
