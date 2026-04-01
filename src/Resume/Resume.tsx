import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../i18n'; // Importing i18n configuration
import { useTranslation } from 'react-i18next';
import './Resume.css'; // Assuming you have some CSS for styling
import data from '../commons/work-experience.json'

const Resume: React.FC = () => {
    const { t, i18n} = useTranslation();

    const getCompanyClassName = (company: string) => {
        switch (company) {
            case 'Amazon Web Services':
                return 'amazon-span';
            case 'Oracle America Inc.':
                return 'oracle-span';
            case 'Intel Corporation':
                return 'intel-span';
            default:
                return 'default-company';
        }
    };
    
    const getEducationClassName = (institution: string) => {
        switch (institution) {
            case 'Tecnológico de Monterrey':
                return 'itesm-span';
            case 'Udemy':
                return 'udemy-span';
            default:
                return 'default-institution';
        }
    };

    const fromDate = (date: string) => {
        const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
        return new Date(date).toLocaleString(locale, { year: 'numeric', month: 'long' });
    };

    const toDate = (date: string) => {
        const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
        const dateObj = new Date(date);
        if (dateObj.getTime() > Date.now()) {
            return t('resume.present', 'Present');
        }
        return dateObj.toLocaleString(locale, { year: 'numeric', month: 'long' });
    };  


    return (
        <div className="resume-container">
            <Helmet>
                <title>Resume | Héctor A. Gómez Reyes</title>
                <meta name="description" content="Resume of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle America, Amazon Web Services, and Intel. Skills include React, TypeScript, Java, Spring Boot, and AWS." />
                <link rel="canonical" href="https://hectoragomez.com/resume" />
                <meta property="og:url" content="https://hectoragomez.com/resume" />
                <meta property="og:title" content="Resume | Héctor A. Gómez Reyes" />
                <meta property="og:description" content="Software Engineer with experience at Oracle, AWS, and Intel. React, TypeScript, Java, Spring Boot, and cloud infrastructure." />
            </Helmet>
            <div className="resume-header">
                <h2>Héctor Alfonso Gómez Reyes<sub>({t('resume.pronouns', 'he/him')})</sub></h2>
                <p>📍Seattle, WA. (US)</p>
                <p>{t('resume.softwareEngineer', 'Software Engineer')}</p>
                <p>{t('resume.fulldetailstext')} @ <a href='https://www.linkedin.com/in/hagomezr' target='_blank' rel='noreferrer'>LinkedIn</a></p>
            </div>
            <div className='work-experience'>
                <h3>{t('resume.workexptitle', 'Work Experience')}</h3>
                {data[i18n.language === 'es' ? 'es' : 'en'].jobs.map((item, index) => (
                    <div key={index} className='work-item'>
                        <h5><span className={getCompanyClassName(item.company)}>{item.company} @ {item.location};</span> {item.title} {t('resume.from', 'from')} {fromDate(item.startDate)} {t('resume.to', 'to')} {toDate(item.endDate)}</h5>
                        <p>{item.description}</p>
                        <ul>
                            {item.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex}>{bullet}</li>
                            ))}
                        </ul>
                        <p><span className="skills-tag">{t('resume.skills', 'Skills')}: </span>{item.skills.join(', ')}</p>
                    </div>))}
            </div>
            <div className='education'>
                <h3>{t('resume.educationtitle', 'Education')}</h3>
                {data[i18n.language === 'es' ? 'es' : 'en'].education.map((item, index) => (
                    <div key={index} className='education-item'>
                        <h5><span className={getEducationClassName(item.institution)}>{item.institution} @ {item.location};</span> {item.degree} {t('resume.classOf', 'class of')} {new Date(item.endDate).toLocaleString('en-US', { year: 'numeric'})}</h5>
                        <p>{item.description}</p>
                    </div>))}
            </div>
            <div className='outside-work'>
                <h3>{t('resume.outsideworktitle', 'Outside Work')}</h3>
                <p>{data[i18n.language === 'es' ? 'es' : 'en'].other.description}</p>
                <p className="skills-tag">{t('resume.languages', 'Languages')}:</p>
                <ul>
                    {data[i18n.language === 'es' ? 'es' : 'en'].other.languages.map((lang, index) => (
                        <li key={index}>{lang.name} [{lang.level}]</li>
                    ))}
                </ul>
                <p><span className="skills-tag">{t('resume.hobbies', 'Hobbies')}:</span> {data[i18n.language === 'es' ? 'es' : 'en'].other.hobbies.join(', ')}</p>
                <p><span className="skills-tag">{t('resume.interests', 'Interests')}:</span> {data[i18n.language === 'es' ? 'es' : 'en'].other.interests.join(', ')}</p>
            </div>
        </div>
    );
};

export default Resume;