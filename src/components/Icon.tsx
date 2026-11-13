import type { SVGProps } from 'react';

const paths: Record<string, JSX.Element> = {
  bolt: <path d="M13.5 2 4.5 13.5H10l-1 8.5L19 10h-5.6z" />,
  cube: (
    <>
      <path d="M12 2.7 20.3 7.4v9.2L12 21.3 3.7 16.6V7.4z" />
      <path d="M3.9 7.5 12 12l8.1-4.5M12 12v9.1" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.2 21 8l-9 4.8L3 8z" />
      <path d="M3 12.2l9 4.8 9-4.8M3 16.4l9 4.8 9-4.8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64 1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.35 9v.06a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.91z" />
    </>
  ),
  screen: (
    <>
      <rect x="2.6" y="3.6" width="18.8" height="12.8" rx="2.4" />
      <path d="M9 21h6M12 16.6V21" />
    </>
  ),
  fan: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 12c0-3 1.8-5.4 5-5.4M12 12c3 0 5.4 1.8 5.4 5M12 12c0 3-1.8 5.4-5 5.4M12 12c-3 0-5.4-1.8-5.4-5" />
    </>
  ),
  spool: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3v3.6M12 17.4V21M3 12h3.6M17.4 12H21" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.9-6.4" />
      <path d="M21 3.5V9h-5.4" />
      <path d="M12 8v4.4l2.8 1.7" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18 2.6 2.6 0 0 0 2.1-4.1 2 2 0 0 1 1.6-3.2h1.6A3.7 3.7 0 0 0 21 10 9 9 0 0 0 12 3z" />
      <circle cx="7.6" cy="10.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.6" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.9v5.6c0 4.4 2.9 7.4 7 9 4.1-1.6 7-4.6 7-9V5.9z" />
      <path d="M9 12.2l2.1 2.1 4-4.2" />
    </>
  ),
  wrench: (
    <path d="M14.6 3.4a5.2 5.2 0 0 0-6.2 6.5L3 15.3V21h5.7l5.4-5.4a5.2 5.2 0 0 0 6.5-6.2l-2.9 2.9-3-.8-.8-3z" />
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7.4" height="7.4" rx="1.6" />
      <rect x="13.6" y="3" width="7.4" height="7.4" rx="1.6" />
      <rect x="3" y="13.6" width="7.4" height="7.4" rx="1.6" />
      <rect x="13.6" y="13.6" width="7.4" height="7.4" rx="1.6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.4A2.4 2.4 0 0 1 6.4 3H20v15.6H6.4A2.4 2.4 0 0 0 4 21z" />
      <path d="M8 7.6h7M8 11h5" />
    </>
  ),
  home: <path d="M3.4 10.4 12 3.2l8.6 7.2V21h-6v-6.2H9.4V21h-6z" />,
  gem: (
    <>
      <path d="M6.4 3h11.2l3.1 5.6L12 21 3.3 8.6z" />
      <path d="M3.3 8.6h17.4M9.6 3 6.4 8.6l5.6 12.4 5.6-12.4L14.4 3" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.2 13.9 9l5.8 1.9-5.8 1.9L12 18.6l-1.9-5.8L4.3 11l5.8-1.9z" />
      <path d="M18.4 3.2v3M16.9 4.7h3" />
    </>
  ),
  check: <path d="M20 6.5 9.4 17.1 4 11.7" />,
  arrow: <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />,
  chevronDown: <path d="M5.5 8.8 12 15.3l6.5-6.5" />,
  menu: <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.4 3.9 5.4 3.9 9s-1.3 6.6-3.9 9c-2.6-2.4-3.9-5.4-3.9-9S9.4 5.4 12 3z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11.5M7.5 10.8 12 15.3l4.5-4.5" />
      <path d="M4.5 20.5h15" />
    </>
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" />
      <path d="M3.4 6.4 12 13l8.6-6.6" />
    </>
  ),
  phone: (
    <path d="M6.4 3h3.1l1.5 4.1-2 1.4a12.3 12.3 0 0 0 6.5 6.5l1.4-2 4.1 1.5v3.1a2.2 2.2 0 0 1-2.4 2.2A17.2 17.2 0 0 1 4.2 5.4 2.2 2.2 0 0 1 6.4 3z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  zoom: (
    <>
      <circle cx="11" cy="11" r="7.4" />
      <path d="M20.5 20.5 16 16M8 11h6M11 8v6" />
    </>
  ),
  send: <path d="M21 3 3 10.4l6.7 2.6L12.3 20z" />,
  user: (
    <>
      <circle cx="12" cy="8.2" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.4" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4.6h5V7M6.5 7l.9 13.4h9.2L17.5 7" />
      <path d="M10.4 11v6M13.6 11v6" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20.5h4.2L20 8.7 15.3 4 3.5 15.8z" />
      <path d="M13.6 5.7 18.3 10.4" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H15" />
      <path d="M18 8.5 21.5 12 18 15.5M10 12h11" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.8 21 19.5H3z" />
      <path d="M12 9.4v4.4M12 16.6v.6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
      <circle cx="8.6" cy="9.6" r="1.5" />
      <path d="M3.6 17.4 9 12l3.2 3.1 2.6-2.4 5.6 5.2" />
    </>
  ),
  play: <path d="M8 4.8 19 12 8 19.2z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7.4" />
      <path d="M20.5 20.5 16 16" />
    </>
  ),
  sparkline: <path d="M3 16.5 8 10l4 3.5L21 4" />,
  chevron: <path d="m6 9.5 6 6 6-6" />,
  layersOff: <path d="M4 5h16M4 12h16M4 19h16" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  const shape = paths[name] ?? paths.cube;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shape}
    </svg>
  );
}
