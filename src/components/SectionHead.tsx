import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadProps {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  center?: boolean;
}

/** Shared editorial section header: index, eyebrow, title and side note. */
export function SectionHead({ id, index, label, title, aside, center }: SectionHeadProps) {
  return (
    <Reveal className={`section-head ${center ? 'section-head--center' : 'section-head--split'}`}>
      <div className="section-head__main">
        <span className="eyebrow">
          <span className="eyebrow__num num">{index}</span>
          {label}
        </span>
        <h2 className="section-title" id={id}>
          {title}
        </h2>
      </div>
      {aside ? <p className="section-head__aside">{aside}</p> : null}
    </Reveal>
  );
}
