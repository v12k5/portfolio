import type { ReactNode } from 'react';
interface Props { children: ReactNode; href: string; className?: string }
export function HardButton({ children, href, className = '' }: Props) { return <a className={`hard-button ${className}`} href={href}>{children}</a>; }
