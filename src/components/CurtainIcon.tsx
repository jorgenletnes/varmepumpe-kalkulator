export default function CurtainIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect x="4" y="11" width="16" height="10" fill="currentColor" opacity="0.25" stroke="none" />
      <path d="M16,11v4m4-8H4v4H20Zm0-4H4V21H20ZM3,21H21M3,3H21" stroke="currentColor" />
    </svg>
  )
}
