import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import { ProjectImageCarousel } from './ProjectImageCarousel';

export function ProjectLink({ project }: { project: Project }) {
  if (project.href) {
    return (
      <a
        className="project-link"
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        View project <ArrowUpRight />
      </a>
    );
  }

  return (
    <span
      className="project-link project-link--disabled"
      aria-disabled="true"
      title="Project link not added yet"
    >
      View project <ArrowUpRight />
    </span>
  );
}

export function ProjectCard({
  project,
  variant = 'technical',
  number,
}: {
  project: Project;
  variant?: 'home' | 'technical' | 'featured' | 'wide';
  number?: number;
}) {
  return (
    <article
      className={`project-card project-card--${variant}`}
      data-project-id={project.id}
      data-element-type="project"
    >
      <ProjectImageCarousel
        images={project.images}
        projectTitle={project.title}
        variant={variant}
      />

      <div className="project-card__body">
        {variant === 'technical' ? (
          <div className="project-meta">
            <span>{project.category}</span>
            <b>{String(number ?? 1).padStart(2, '0')}</b>
          </div>
        ) : (
          <p className="eyebrow">
            {variant === 'featured'
              ? `FEATURED · ${project.category.toUpperCase()}`
              : project.homeCategory}
          </p>
        )}

        <h2>{project.title}</h2>        {project.subtitle && (
          <h3 className="project-subtitle">{project.subtitle}</h3>
        )}

        <p className="project-description">{project.description}</p>

        {variant !== 'home' && (
          <div className="tag-list">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <ProjectLink project={project} />
      </div>
    </article>
  );
}