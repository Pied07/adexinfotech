export function MsmeLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="msme-logo-inline" aria-label="MSME Certified">
        <svg
          width="28"
          height="20"
          viewBox="0 0 64 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="1" y="1" width="62" height="42" rx="7" fill="#0B1221" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <rect x="4" y="4" width="56" height="6" rx="2" fill="#FF9933" />
          <rect x="4" y="10" width="56" height="24" fill="#FFFFFF" />
          <rect x="4" y="34" width="56" height="6" rx="2" fill="#138808" />
          <circle cx="15" cy="22" r="6.5" stroke="#000080" strokeWidth="1.5" />
          <circle cx="15" cy="22" r="1.5" fill="#000080" />
          <text
            x="24"
            y="26.5"
            fill="#0A192F"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="12.5"
            letterSpacing="0.4"
          >
            MSME
          </text>
        </svg>
        <span className="msme-logo-inline-text">MSME CERTIFIED</span>
      </span>
    )
  }

  return (
    <div className="msme-logo-badge" aria-label="MSME Certified">
      <svg
        width="154"
        height="54"
        viewBox="0 0 180 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MSME Certified Logo"
      >
        <rect x="1.5" y="1.5" width="177" height="59" rx="10" fill="#0B1324" stroke="rgba(34, 211, 238, 0.35)" strokeWidth="1.5" />
        {/* Tricolor top & bottom bars */}
        <rect x="10" y="9" width="160" height="4.5" rx="2" fill="#FF9933" />
        <rect x="10" y="48.5" width="160" height="4.5" rx="2" fill="#138808" />
        {/* White center band */}
        <rect x="10" y="14.5" width="160" height="33" rx="3" fill="#F8FAFC" />
        {/* Ashoka-inspired gear/chakra emblem */}
        <circle cx="31" cy="31" r="10.5" stroke="#0B3B8C" strokeWidth="2" />
        <circle cx="31" cy="31" r="2.2" fill="#0B3B8C" />
        <line x1="31" y1="20.5" x2="31" y2="41.5" stroke="#0B3B8C" strokeWidth="1.1" />
        <line x1="20.5" y1="31" x2="41.5" y2="31" stroke="#0B3B8C" strokeWidth="1.1" />
        <line x1="23.6" y1="23.6" x2="38.4" y2="38.4" stroke="#0B3B8C" strokeWidth="1.1" />
        <line x1="38.4" y1="23.6" x2="23.6" y2="38.4" stroke="#0B3B8C" strokeWidth="1.1" />
        {/* MSME Wordmark */}
        <text
          x="49"
          y="33"
          fill="#0F172A"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="21"
          letterSpacing="1.2"
        >
          MSME
        </text>
        <text
          x="49.5"
          y="43"
          fill="#0B3B8C"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="8.5"
          letterSpacing="2.2"
        >
          CERTIFIED
        </text>
        {/* Verified check seal */}
        <circle cx="151" cy="31" r="9.5" fill="#138808" />
        <path d="M146.5 31.2L149.6 34.3L155.8 27.9" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
