import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../lib/hooks';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  id?: string;
}

/** Fades content in once it enters the viewport (CSS handles reduced motion). */
export function Reveal({ children, delay = 0, className = '', as, id }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
