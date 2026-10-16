import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { HardButton } from '@/components/shared/HardButton';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Reveal } from '@/components/shared/Reveal';
export function HomeProjectsSection() { const items = projects.filter((project) => project.homeOrder).sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0)); return <section className="section page-shell" id="projects-preview"><div className="section-heading"><h2 className="display-sans">Projects</h2><HardButton href="/projects">View all <ArrowRight /></HardButton></div><div className="home-project-grid">{items.map((project) => <Reveal key={project.id}><ProjectCard project={project} variant="home" /></Reveal>)}</div></section>; }
