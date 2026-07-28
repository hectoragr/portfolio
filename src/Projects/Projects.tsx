import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import projectsData from '../commons/projects.json';
import './Projects.scss';

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string | null;
  thumbnail: string | null;
};

type ProjectsData = Record<'en' | 'es', { projects: Project[] }>;

const AUTHOR_NAME = 'Héctor Alfonso Gómez Reyes';

/**
 * Search-engine structured data for the project list.
 *
 * Exported so it can be exercised directly: the mapping must stay exactly one
 * CreativeWork entry per project, in order.
 */
export const buildProjectsJsonLd = (projects: Project[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: projects.map((project, index) => ({
    '@type': 'CreativeWork',
    position: index + 1,
    name: project.title,
    description: project.description,
    url: project.liveUrl,
    author: { '@type': 'Person', name: AUTHOR_NAME },
  })),
});

const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'es' ? 'es' : 'en';

  // Falls back to English if a locale block is ever missing, so a bad data edit
  // degrades to the wrong language rather than a blank page.
  const data = projectsData as ProjectsData;
  const projects = (data[lang] ?? data.en).projects;

  return (
    <div className="projects-page">
      <Helmet>
        <title>Projects | Héctor A. Gómez Reyes</title>
        <meta
          name="description"
          content="Selected software projects by Héctor A. Gómez Reyes — built with React, TypeScript, AWS, and Terraform."
        />
        <link rel="canonical" href="https://hectoragomez.com/projects" />
        <meta property="og:url" content="https://hectoragomez.com/projects" />
        <meta property="og:title" content="Projects | Héctor A. Gómez Reyes" />
        <meta
          property="og:description"
          content="Selected software projects built with React, TypeScript, AWS, and Terraform."
        />
        <script type="application/ld+json">
          {JSON.stringify(buildProjectsJsonLd(projects))}
        </script>
      </Helmet>

      <div className="projects-page__header">
        <div className="projects-page__accent" />
        <h1 className="projects-page__title">{t('projects.title', 'Projects')}</h1>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <article key={project.id} className="project-card">
            <h2 className="project-card__title">{project.title}</h2>
            <p className="project-card__description">{project.description}</p>

            <div className="project-card__tags">
              {project.techStack.map(tech => (
                <span key={tech} className="project-card__tag">
                  {tech}
                </span>
              ))}
            </div>

            <div className="project-card__links">
              <a
                className="project-card__link"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t('projects.viewLive', 'View Live')}
              </a>
              {/* repoUrl is nullable for closed-source work. */}
              {project.repoUrl && (
                <a
                  className="project-card__link"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('projects.viewSource', 'View Source')}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Projects;
