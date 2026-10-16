import { ArrowUpRight } from 'lucide-react';
import { ProjectImageCarousel } from '@/components/projects/ProjectImageCarousel';
import { Reveal } from '@/components/shared/Reveal';
import { experience } from '@/data/experience';

export function ExperienceSection() {
  return (
    <section className="section page-shell" id="experience">
      <div className="section-heading">
        <h2 className="display-serif">{experience.heading}</h2>
      </div>

      <Reveal>
        <article
          className="project-card project-card--featured"
          data-element-id={experience.id}
          data-element-type="experience"
        >
          <ProjectImageCarousel
            images={experience.images}
            projectTitle={experience.title}
            variant="featured"
          />

          <div className="project-card__body">
            <p className="eyebrow">
              {experience.role} · {experience.dates}
            </p>
            <h2>{experience.title}</h2>
            <p className="project-description">{experience.description}</p>

            <div className="tag-list">
              {experience.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <a
              className="project-link"
              href={experience.viewMoreHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              View project <ArrowUpRight />
            </a>
          </div>
        </article>
      </Reveal>
    </section>
  );
}