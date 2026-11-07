const paths = {
  search: <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.8-.2L20 21" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.5c.6-3.6 3.7-5.7 7.5-5.7s6.9 2.1 7.5 5.7" />
    </>
  ),
  heart: (
    <path d="M12 20.2S3.8 15.4 3.8 9.6A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.2 3c0 5.8-8.2 10.6-8.2 10.6Z" />
  ),
  bag: (
    <>
      <path d="M5.5 8h13l1 12.5h-15L5.5 8Z" />
      <path d="M9 8V6.6a3 3 0 0 1 6 0V8" />
    </>
  ),
  menu: (
    <>
      <path d="M4 8h16M4 16h16" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  arrowRight: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8.5M17 7v8.5" />,
  truck: (
    <>
      <path d="M3 6.5h10.5v9H3zM13.5 10h4l3 3v2.5h-7z" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  returns: (
    <>
      <path d="M4 8.5h11.5a4 4 0 0 1 0 8H8" />
      <path d="M7.5 5 4 8.5 7.5 12" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14.5" r="5" />
      <path d="M9 9.5 6.5 3.5h11L15 9.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="M4.5 12.5 9.5 17.5 20 6.5" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
    </>
  ),
  star: (
    <path d="m12 4 2.4 5.1 5.6.7-4.1 3.8 1.1 5.5-5-2.9-5 2.9 1.1-5.5L4 9.8l5.6-.7L12 4Z" />
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  list: <path d="M4 6h16M4 12h16M4 18h16" />,
  filter: <path d="M4 7h16M7 12h10M10 17h4" />,
  zoom: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4M11 8.5v5M8.5 11h5" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.8 7.4h.01" />
    </>
  ),
  facebook: <path d="M14.5 8.5h2.5V5h-2.5A4 4 0 0 0 10.5 9v2H8v3.5h2.5V21H14v-6.5h2.6l.4-3.5H14V9.4a.9.9 0 0 1 .5-.9Z" />,
  pinterest: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 20l2-8.5M9.8 14.2c-.7-1.6-.2-4 1.9-4.4 2-.4 3.3.8 3.2 2.6-.1 2-1.6 3.6-3.1 3" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: <path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5.5a2 2 0 0 1 2-2Z" />,
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  package: (
    <>
      <path d="M3.5 8 12 3.5 20.5 8v8L12 20.5 3.5 16V8Z" />
      <path d="M3.5 8 12 12.5 20.5 8M12 12.5v8" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M3 10.5h18" />
    </>
  ),
  sparkle: <path d="M12 3v6m0 6v6M3 12h6m6 0h6" />,
  logout: (
    <>
      <path d="M14 5.5H6v13h8" />
      <path d="M12 12h9m0 0-3.5-3.5M21 12l-3.5 3.5" />
    </>
  ),
  edit: <path d="M4 20h4L20 8l-4-4L4 16v4Z" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  dashboard: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="4" />
      <rect x="13" y="10" width="7" height="10" />
      <rect x="4" y="13" width="7" height="7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3.5 19c.5-3 2.8-4.6 5.5-4.6S14 16 14.5 19" />
      <path d="M16 6.5a3 3 0 0 1 0 5.8M17.5 14.6c2 .5 3.2 2.2 3.5 4.4" />
    </>
  ),
  tag: (
    <>
      <path d="M4 12.5V4.5h8L20 12.5 12.5 20 4 12.5Z" />
      <circle cx="8" cy="8" r="1.2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.2-1.6l2-1.4-2-3.4-2.3.9a7 7 0 0 0-2.7-1.6L13.5 2h-3l-.3 2.9a7 7 0 0 0-2.7 1.6l-2.3-.9-2 3.4 2 1.4A7 7 0 0 0 5 12c0 .5.1 1.1.2 1.6l-2 1.4 2 3.4 2.3-.9a7 7 0 0 0 2.7 1.6l.3 2.9h3l.3-2.9a7 7 0 0 0 2.7-1.6l2.3.9 2-3.4-2-1.4c.1-.5.2-1.1.2-1.6Z" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" />
      <path d="m4 16 5-5 4 4 2.5-2.5L20 17.5" />
      <circle cx="9" cy="9" r="1.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
};

export default function Icon({ name, className = 'h-4 w-4', strokeWidth = 1.3, fill = 'none' }) {
  const path = paths[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill === 'solid' ? 'currentColor' : 'none'}
      stroke={fill === 'solid' ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}
