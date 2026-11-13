import { useId } from 'react';

export type ArtVariant =
  | 'full'
  | 'side'
  | 'rear'
  | 'detail'
  | 'head'
  | 'filament'
  | 'screen'
  | 'models'
  | 'usage';

const CROPS: Record<ArtVariant, string> = {
  full: '0 0 1200 1000',
  side: '40 90 780 840',
  rear: '40 90 780 840',
  detail: '250 480 480 420',
  head: '240 230 380 260',
  filament: '830 130 330 780',
  screen: '560 180 250 300',
  models: '270 400 400 360',
  usage: '0 30 1200 940',
};

interface PrinterArtProps {
  variant?: ArtVariant;
  label?: string;
  className?: string;
  blue?: string;
}

/**
 * Simulated product render of the AD5X. Drawn in SVG so every view stays crisp
 * and can be replaced later by a real photograph through the admin image field.
 */
export function PrinterArt({ variant = 'full', label, className, blue = '#0789E8' }: PrinterArtProps) {
  const uid = useId().replace(/[:]/g, '');
  const id = (name: string) => `${name}-${uid}`;
  const isRear = variant === 'rear';

  return (
    <svg
      className={className}
      viewBox={CROPS[variant]}
      role="img"
      aria-label={label ?? 'Flashforge AD5X product render'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={id('glow')} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={blue} stopOpacity="0.34" />
          <stop offset="55%" stopColor={blue} stopOpacity="0.09" />
          <stop offset="100%" stopColor={blue} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('body')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#242c38" />
          <stop offset="42%" stopColor="#161c25" />
          <stop offset="100%" stopColor="#0a0e14" />
        </linearGradient>
        <linearGradient id={id('metal')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f4f9" />
          <stop offset="30%" stopColor="#b9c2cd" />
          <stop offset="65%" stopColor="#717b88" />
          <stop offset="100%" stopColor="#d5dce5" />
        </linearGradient>
        <linearGradient id={id('rail')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5d6672" />
          <stop offset="35%" stopColor="#dbe3ec" />
          <stop offset="60%" stopColor="#98a2ae" />
          <stop offset="100%" stopColor="#4b535f" />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#9ec8ff" stopOpacity="0.16" />
          <stop offset="45%" stopColor="#0e1a2a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#071019" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={id('bed')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39424f" />
          <stop offset="100%" stopColor="#151b23" />
        </linearGradient>
        <linearGradient id={id('roof')} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#6fc2ff" />
          <stop offset="60%" stopColor={blue} />
          <stop offset="100%" stopColor="#0755a5" />
        </linearGradient>
        <linearGradient id={id('screen')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b2136" />
          <stop offset="100%" stopColor="#050c14" />
        </linearGradient>
        <linearGradient id={id('plate')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#141b24" />
          <stop offset="50%" stopColor="#0c1118" />
          <stop offset="100%" stopColor="#171f29" />
        </linearGradient>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ccbff" stopOpacity="0.75" />
          <stop offset="34%" stopColor="#7ccbff" stopOpacity="0.12" />
          <stop offset="66%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#7ccbff" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={id('spool')} cx="34%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id={id('vase')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6fafd" />
          <stop offset="42%" stopColor="#d5e2ee" />
          <stop offset="78%" stopColor="#9fb4c8" />
          <stop offset="100%" stopColor="#7b91a6" />
        </linearGradient>
        <filter id={id('soft')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={id('led')} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ambient glow + floor shadow */}
      <ellipse cx="560" cy="470" rx="520" ry="420" fill={`url(#${id('glow')})`} />
      <ellipse cx="600" cy="918" rx="470" ry="26" fill="#000" opacity="0.55" filter={`url(#${id('soft')})`} />

      {/* side filament rack */}
      <g>
        <rect x="890" y="160" width="200" height="770" rx="30" fill={`url(#${id('plate')})`} stroke="#ffffff14" />
        <rect x="980" y="560" width="20" height="360" rx="10" fill="#0a0f15" />
        <rect x="750" y="508" width="150" height="18" rx="9" fill={`url(#${id('rail')})`} opacity="0.85" />
        {[
          { cy: 270, color: '#0789E8' },
          { cy: 440, color: '#EDF1F6' },
          { cy: 610, color: '#FF7A2F' },
          { cy: 780, color: '#AEB7C2' },
        ].map((spool) => (
          <g key={spool.cy}>
            <ellipse cx="990" cy={spool.cy + 84} rx="66" ry="10" fill="#000" opacity="0.4" filter={`url(#${id('soft')})`} />
            <circle cx="990" cy={spool.cy} r="82" fill="#0b1018" stroke="#ffffff14" />
            <circle cx="990" cy={spool.cy} r="72" fill={spool.color} opacity="0.94" />
            <circle cx="990" cy={spool.cy} r="72" fill={`url(#${id('spool')})`} />
            {[24, 36, 48, 60, 68].map((radius) => (
              <circle
                key={radius}
                cx="990"
                cy={spool.cy}
                r={radius}
                fill="none"
                stroke="#000"
                strokeOpacity="0.14"
                strokeWidth="1.6"
              />
            ))}
            <circle cx="990" cy={spool.cy} r="72" fill="none" stroke="#ffffff2e" strokeWidth="1.4" />
            <circle cx="990" cy={spool.cy} r="40" fill="#0b1017" stroke="#ffffff1a" />
            <circle cx="990" cy={spool.cy} r="40" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="6" />
            <circle cx="990" cy={spool.cy} r="13" fill="#28323f" />
            <circle cx="990" cy={spool.cy} r="5" fill="#3d4a5a" />
            <path
              d={`M918 ${spool.cy} a72 72 0 0 1 52 -69`}
              stroke="#ffffff"
              strokeOpacity="0.28"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>

      {/* machine */}
      <g>
        {/* feet */}
        <rect x="168" y="852" width="72" height="16" rx="8" fill="#0a0e14" />
        <rect x="640" y="852" width="72" height="16" rx="8" fill="#0a0e14" />
        <ellipse cx="440" cy="906" rx="290" ry="16" fill={blue} opacity="0.2" filter={`url(#${id('soft')})`} />

        {/* main body */}
        <rect x="130" y="120" width="620" height="740" rx="26" fill={`url(#${id('body')})`} stroke="#ffffff1c" />
        <rect x="130" y="120" width="620" height="740" rx="26" fill="none" stroke={`url(#${id('rim')})`} strokeWidth="1.5" />
        <line x1="130" y1="180" x2="130" y2="820" stroke="#7ccbff" strokeOpacity="0.34" strokeWidth="1.2" />
        <rect x="130" y="120" width="620" height="34" rx="17" fill={`url(#${id('metal')})`} opacity="0.92" />
        <rect x="130" y="120" width="620" height="34" rx="17" fill="none" stroke="#ffffff45" />

        {/* top ambient light strip */}
        <rect x="168" y="160" width="544" height="3" rx="1.5" fill={blue} filter={`url(#${id('led')})`} opacity="0.9" />

        {/* glass chamber */}
        <rect x="156" y="186" width="436" height="580" rx="14" fill="#080d13" stroke="#ffffff22" />
        <g clipPath={`url(#${id('clip')})`}>
          <defs>
            <clipPath id={id('clip')}>
              <rect x="158" y="188" width="432" height="576" rx="12" />
            </clipPath>
          </defs>

          {isRear ? (
            <g>
              <rect x="158" y="188" width="432" height="576" fill="#0b1017" />
              {Array.from({ length: 14 }).map((_, i) => (
                <rect
                  key={i}
                  x="200"
                  y={250 + i * 30}
                  width="348"
                  height="9"
                  rx="4.5"
                  fill="#1b232e"
                  stroke="#ffffff10"
                />
              ))}
              <rect x="470" y="700" width="72" height="46" rx="6" fill="#161d26" stroke="#ffffff20" />
              <circle cx="490" cy="723" r="4" fill="#0a0f15" />
              <circle cx="521" cy="723" r="4" fill="#0a0f15" />
              <path d="M506 746c0 22 14 30 40 34s46 6 46 26" stroke="#0a0f15" strokeWidth="7" fill="none" />
            </g>
          ) : (
            <g>
              <rect x="158" y="188" width="432" height="576" fill="#0a1017" />
              <rect x="158" y="188" width="432" height="140" fill="#0d141d" />
              <ellipse cx="374" cy="700" rx="190" ry="34" fill="#000" opacity="0.45" filter={`url(#${id('soft')})`} />

              {/* vertical rails */}
              <rect x="172" y="206" width="10" height="530" rx="5" fill={`url(#${id('rail')})`} opacity="0.8" />
              <rect x="566" y="206" width="10" height="530" rx="5" fill={`url(#${id('rail')})`} opacity="0.8" />

              {/* X beam + carriage */}
              <rect x="176" y="286" width="396" height="13" rx="6.5" fill={`url(#${id('rail')})`} />
              <rect x="176" y="300" width="396" height="2.5" fill={blue} opacity="0.85" filter={`url(#${id('led')})`} />
              <rect x="318" y="272" width="92" height="34" rx="7" fill="#1a212c" stroke="#ffffff22" />
              <rect x="350" y="306" width="28" height="44" rx="5" fill="#202834" stroke="#ffffff1a" />
              <rect x="355" y="314" width="18" height="22" rx="3" fill="#39434f" />
              <path d="M356 350h16l-4 12h-8z" fill="#c9d2dc" />
              <circle cx="364" cy="366" r="3" fill="#ff8a3d" />
              <path d="M410 288c46-6 62 4 74 22s-6 30-6 30" stroke="#0c1219" strokeWidth="8" fill="none" strokeLinecap="round" />

              {/* bed */}
              <polygon points="196,652 552,652 582,734 166,734" fill={`url(#${id('bed')})`} stroke="#ffffff1f" />
              <polygon points="196,652 552,652 552,658 196,658" fill="#59636f" opacity="0.55" />
              <polygon points="166,734 582,734 582,744 166,744" fill="#0b1016" />
              <g stroke="#ffffff12" strokeWidth="1.2">
                <path d="M266 652 236 734M366 652 366 734M466 652 496 734" />
                <path d="M196 678h370M180 706h408" />
              </g>
              <rect x="316" y="676" width="116" height="8" rx="4" fill="#2a3441" stroke="#ffffff14" />

              {/* printed vase */}
              <defs>
                <clipPath id={id('vaseClip')}>
                  <path d="M344 690 C336 664 342 644 356 630 C368 618 370 600 362 586 L362 578 L386 578 L386 586 C378 600 380 618 392 630 C406 644 412 664 404 690 Z" />
                </clipPath>
              </defs>
              <g>
                <ellipse cx="374" cy="692" rx="56" ry="9" fill="#000" opacity="0.55" />
                <ellipse cx="374" cy="690" rx="60" ry="22" fill={blue} opacity="0.16" filter={`url(#${id('soft')})`} />
                <path
                  d="M344 690 C336 664 342 644 356 630 C368 618 370 600 362 586 L362 578 L386 578 L386 586 C378 600 380 618 392 630 C406 644 412 664 404 690 Z"
                  fill={`url(#${id('vase')})`}
                />
                <g clipPath={`url(#${id('vaseClip')})`}>
                  {Array.from({ length: 11 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M330 ${592 + i * 9.4} Q374 ${596 + i * 9.4} 418 ${592 + i * 9.4}`}
                      stroke={i % 2 ? '#0b2136' : '#ffffff'}
                      strokeOpacity={i % 2 ? 0.1 : 0.22}
                      strokeWidth="1.6"
                      fill="none"
                    />
                  ))}
                  <path d="M352 584 C344 626 350 664 356 690" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="4" fill="none" />
                  <path d="M398 584 C406 626 400 664 394 690" stroke="#3f5d78" strokeOpacity="0.35" strokeWidth="6" fill="none" />
                </g>
                <path
                  d="M344 690 C336 664 342 644 356 630 C368 618 370 600 362 586 L362 578 L386 578 L386 586 C378 600 380 618 392 630 C406 644 412 664 404 690 Z"
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.55"
                  strokeWidth="1.2"
                />
                <ellipse cx="374" cy="578" rx="12" ry="4" fill="#0b2136" opacity="0.65" />
              </g>

              {/* interior light */}
              <rect x="166" y="196" width="416" height="4" rx="2" fill={blue} opacity="0.75" filter={`url(#${id('led')})`} />
              <rect x="158" y="188" width="432" height="576" fill={`url(#${id('glass')})`} />
              <polygon points="180,188 320,188 180,560" fill="#ffffff" opacity="0.05" />
              <polygon points="360,188 420,188 250,770 190,770" fill="#ffffff" opacity="0.035" />
            </g>
          )}
        </g>
        <rect x="156" y="186" width="436" height="580" rx="14" fill="none" stroke="#9ec8ff33" />

        {/* control column */}
        <rect x="606" y="186" width="126" height="580" rx="12" fill="#0d131a" stroke="#ffffff16" />
        <rect x="612" y="196" width="6" height="120" rx="3" fill={blue} opacity="0.5" filter={`url(#${id('led')})`} />

        {/* touchscreen */}
        <g>
          <rect x="616" y="240" width="106" height="150" rx="10" fill="#050a10" stroke="#ffffff22" />
          <rect x="622" y="246" width="94" height="106" rx="6" fill={`url(#${id('screen')})`} />
          <rect x="628" y="252" width="46" height="6" rx="3" fill={blue} opacity="0.85" />
          <rect x="628" y="266" width="70" height="4" rx="2" fill="#ffffff" opacity="0.35" />
          <rect x="628" y="276" width="54" height="4" rx="2" fill="#ffffff" opacity="0.22" />
          <circle cx="669" cy="316" r="26" fill="none" stroke={blue} strokeOpacity="0.55" strokeWidth="2.5" />
          <circle cx="669" cy="316" r="26" fill="none" stroke={blue} strokeWidth="26" strokeOpacity="0.12" />
          <path d="M669 298v18l12 8" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" fill="none" />
          <circle cx="641" cy="366" r="9" fill="#1b2430" stroke="#ffffff22" />
          <circle cx="669" cy="366" r="9" fill="#1b2430" stroke="#ffffff22" />
          <circle cx="697" cy="366" r="9" fill={blue} opacity="0.7" />
        </g>

        <circle cx="669" cy="470" r="16" fill="#111820" stroke="#ffffff20" />
        <circle cx="669" cy="470" r="5" fill={blue} opacity="0.9" />

        {/* brand line */}
        <text
          x="669"
          y="706"
          textAnchor="middle"
          fill="#8f9aa8"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="11"
          letterSpacing="3"
        >
          FLASHFORGE
        </text>
        <rect x="630" y="720" width="78" height="1.6" fill="#ffffff20" />
      </g>
    </svg>
  );
}
