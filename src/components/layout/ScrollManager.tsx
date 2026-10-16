import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export function ScrollManager() { const location = useLocation(); useEffect(() => { const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; const id = location.hash.slice(1); const timer = window.setTimeout(() => { if (id) document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); else window.scrollTo({ top: 0, behavior: 'auto' }); }, 40); return () => window.clearTimeout(timer); }, [location]); return null; }
