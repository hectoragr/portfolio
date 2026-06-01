import React from 'react';
import { Helmet } from 'react-helmet-async';
import './FAQ.scss';

const Faq: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Socials | Héctor A. Gómez Reyes</title>
        <meta name="description" content="Social links and contact info for Héctor A. Gómez Reyes — Software Engineer." />
        <link rel="canonical" href="https://hectoragomez.com/faq" />
      </Helmet>
      <div className="faq-page">
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div
          className="elfsight-app-fa34dd46-8657-4fdb-8fa8-a07b59345724"
          data-elfsight-app-lazy
        />
      </div>
    </div>
  );
};

export default Faq;
