import React from 'react';
import { Helmet } from 'react-helmet-async';

function Faq() {
    return(
        <div>
            <Helmet>
                <title>FAQ | Héctor A. Gómez Reyes</title>
                <meta name="description" content="Frequently asked questions about Héctor A. Gómez Reyes — Software Engineer." />
                <link rel="canonical" href="https://hectoragomez.com/faq" />
            </Helmet>
            <script src="https://elfsightcdn.com/platform.js" async></script>
            <div className="elfsight-app-fa34dd46-8657-4fdb-8fa8-a07b59345724" data-elfsight-app-lazy></div>
        </div>
    );
}

export default Faq;