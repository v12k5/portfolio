import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { profile } from '@/data/profile';
import { SafeImage } from '@/components/shared/SafeImage';
import { GitHubIcon, LinkedInIcon } from '@/components/shared/icons';
import { useActiveSection } from '@/hooks/useActiveSection';

function SocialLink({ href, label, children }: { href: string | null; label: string; children: React.ReactNode }) { return href ? <a className="social-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a> : <span className="social-link social-link--disabled" aria-disabled="true" title="Link not added yet">{children}</span>; }
export function Header() {
  const location = useLocation(); const navigate = useNavigate(); const activeSection = useActiveSection(); const [open, setOpen] = useState(false); const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: MouseEvent) => { if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false); }; const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; document.addEventListener('mousedown', close); document.addEventListener('keydown', esc); return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); }; }, [open]);
  const isActive = (label: string) => location.pathname === '/projects' ? label === 'Project' : label === 'Home' ? activeSection === 'home' : activeSection === label.toLowerCase();
  const go = (to: string) => { setOpen(false); if (to === '/' && location.pathname === '/') window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); else navigate(to); };
  return <header className="site-header"><div className="header-inner page-shell">
    <div className="brand">
      <SafeImage
        src={profile.avatar.src}
        alt={profile.avatar.alt}
        label="Profile image"
        className="avatar"
        zoomable={false}
      />
      <Link
        to="/"
        onClick={() => {
          if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <span>{profile.name}</span>
      </Link>
    </div>
    <nav className="desktop-nav" aria-label="Primary navigation"><div className="nav-capsule">{profile.nav.map((item) => <button type="button" className={`nav-pill ${isActive(item.label) ? 'is-active' : ''}`} key={item.label} onClick={() => go(item.to)}>{item.label}</button>)}</div></nav>
    <div className="socials desktop-socials"><SocialLink href={profile.socialLinks.linkedin} label="LinkedIn"><LinkedInIcon /></SocialLink><SocialLink href={profile.socialLinks.github} label="GitHub"><GitHubIcon /></SocialLink></div>
    <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <div className="mobile-menu" ref={menuRef}><nav aria-label="Mobile navigation">{profile.nav.map((item) => <button type="button" className={`nav-pill ${isActive(item.label) ? 'is-active' : ''}`} key={item.label} onClick={() => go(item.to)}>{item.label}</button>)}</nav><div className="socials"><SocialLink href={profile.socialLinks.linkedin} label="LinkedIn"><LinkedInIcon /></SocialLink><SocialLink href={profile.socialLinks.github} label="GitHub"><GitHubIcon /></SocialLink></div></div>}
  </div></header>;
}
