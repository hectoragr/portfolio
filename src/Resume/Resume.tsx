import React from 'react';
import '../i18n'; // Importing i18n configuration
import { useTranslation } from 'react-i18next';
import './Resume.css'; // Assuming you have some CSS for styling
import data from '../commons/work-experience.json'

const Resume: React.FC = () => {
    const { t } = useTranslation();

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

    return (
        <div className="resume-container">
            <div className="resume-header">
                <h2>Héctor Alfonso Gómez Reyes<sub>({t('pronouns', 'he/him')})</sub></h2>
                <p>📍Seattle, WA. (US)</p>
                <p>{t('resume.softwareEng', 'Software Engineer')}</p>
                <p>{t('resume.fulldetailstext')} @ <a href='https://www.linkedin.com/in/hagomezr' target='_blank' rel='noreferrer'>LinkedIn</a></p>
            </div>
            <div className='work-experience'>
                <h3>{t('resume.workexptitle', 'Work Experience')}</h3>
                {data.jobs.map((item, index) => (
                    <div key={index} className='work-item'>
                        <h5><span className={getCompanyClassName(item.company)}>{item.company} @ {item.location};</span> {item.title} {t('resume.from', 'from')} {new Date(item.startDate).toLocaleString('en-US', { year: 'numeric', month: 'long'})} {t('resume.to', 'to')} {new Date(item.endDate).toLocaleString('en-US', { year: 'numeric', month: 'long'})}</h5>
                        <p>{item.description}</p>
                        <ul>
                            {item.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex}>{bullet}</li>
                            ))}
                        </ul>
                        <p><span className="skills-tag">{t('common.skills', 'Skills')}: </span>{item.skills.join(', ')}</p>
                    </div>))}
            </div>
            <div className='education'>
                <h3>{t('resume.educationtitle', 'Education')}</h3>
                {data.education.map((item, index) => (
                    <div key={index} className='education-item'>
                        <h5><span className={getEducationClassName(item.institution)}>{item.institution} @ {item.location};</span> {item.degree} {t('resume.class', 'class of')} {new Date(item.endDate).toLocaleString('en-US', { year: 'numeric'})}</h5>
                        <p>{item.description}</p>
                    </div>))}
            </div>
            <div className='outside-work'>
                <h3>{t('resume.outsideworktitle', 'Outside Work')}</h3>
                <p>{data.other.description}</p>
                <p className="skills-tag">{t('resume.laguages', 'Languages')}:</p>
                <ul>
                    {data.other.languages.map((lang, index) => (
                        <li key={index}>{lang.name} [{lang.level}]</li>
                    ))}
                </ul>
                <p><span className="skills-tag">{t('resume.hobbies', 'Hobbies')}:</span> {data.other.hobbies.join(', ')}</p>
                <p><span className="skills-tag">{t('resume.interests', 'Interests')}:</span> {data.other.interests.join(', ')}</p>
            </div>
        </div>
    );
};

export default Resume;