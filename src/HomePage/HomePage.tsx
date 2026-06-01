import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import skillsData from '../commons/skills.json';
import workData from '../commons/work-experience.json';
import './HomePage.scss';

type WorkData = {
  en: { jobs: Job[] };
  es: { jobs: Job[] };
};

type Job = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
};

type SkillCategory = {
  name: string;
  nameEs: string;
  skills: string[];
};

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'es' ? 'es' : 'en';
  const jobs = (workData as WorkData)[lang].jobs;

  const fromDate = (date: string) => {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Date(date).toLocaleString(locale, { year: 'numeric', month: 'short' });
  };

  const toDate = (date: string) => {
    if (new Date(date).getTime() > Date.now()) return t('resume.present', 'Present');
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Date(date).toLocaleString(locale, { year: 'numeric', month: 'short' });
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>Héctor A. Gómez Reyes | Software Engineer</title>
        <meta name="description" content="Personal website of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle, AWS, and Intel. React, TypeScript, Java, and cloud infrastructure." />
        <link rel="canonical" href="https://hectoragomez.com" />
        <meta property="og:url" content="https://hectoragomez.com" />
        <meta property="og:title" content="Héctor A. Gómez Reyes | Software Engineer" />
        <meta property="og:description" content="Personal website of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle, AWS, and Intel." />
      </Helmet>

      {/* About */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('home.aboutTitle', 'About Me')}</h2>
        </div>
        <p className="home-section__bio">{t('home.bio', 'Software Engineer with experience building production systems at Oracle Cloud Infrastructure, Amazon Web Services, and Intel.')}</p>
      </section>

      {/* Skills */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('home.skillsTitle', 'Skills')}</h2>
        </div>
        <div className="skills-grid">
          {(skillsData.categories as SkillCategory[]).map(cat => (
            <div key={cat.name} className="skills-card">
              <div className="skills-card__category">
                {lang === 'es' ? cat.nameEs : cat.name}
              </div>
              <div className="skills-card__tags">
                {cat.skills.map(skill => (
                  <span key={skill} className="skills-card__tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('home.experienceTitle', 'Experience')}</h2>
        </div>
        <div className="experience-timeline">
          {jobs.map((job, idx) => (
            <div key={idx} className="timeline-item">
              <div className={`timeline-item__dot${idx === 0 ? ' timeline-item__dot--active' : ''}`} />
              <div className="timeline-item__content">
                <div className="timeline-item__period">
                  {fromDate(job.startDate)} — {toDate(job.endDate)}
                </div>
                <div className="timeline-item__company">{job.company}</div>
                <div className="timeline-item__title">{job.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
