import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) { const [ref, visible] = useReveal<HTMLDivElement>(); return <div ref={ref} className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}>{children}</div>; }
