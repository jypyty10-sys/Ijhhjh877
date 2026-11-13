import type { ReactNode } from 'react';
import { PrinterArt } from './PrinterArt';

interface ProductStageProps {
  label: string;
  image?: string | null;
  className?: string;
  children?: ReactNode;
}

/**
 * Studio presentation for the product: spotlight, light shaft, floor rings,
 * a soft reflection and optional floating callouts.
 */
export function ProductStage({ label, image, className = '', children }: ProductStageProps) {
  const art = (alt: string) =>
    image ? (
      <img className="stage__art" src={image} alt={alt} />
    ) : (
      <PrinterArt variant="full" label={alt} className="stage__art" />
    );

  return (
    <div className={`stage ${className}`.trim()}>
      <span className="stage__halo" aria-hidden="true" />
      <span className="stage__beam" aria-hidden="true" />
      <span className="stage__floor" aria-hidden="true">
        <span className="stage__ring stage__ring--outer" />
        <span className="stage__ring stage__ring--inner" />
        <span className="stage__pool" />
      </span>

      <div className="stage__product">
        {art(label)}
        <div className="stage__reflection" aria-hidden="true">
          {art('')}
        </div>
      </div>

      {children}
    </div>
  );
}
