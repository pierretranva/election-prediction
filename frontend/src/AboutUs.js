import React from 'react';
import { Typography, Link } from '@mui/material';
import './App.css';

const AboutUs = () => {
    return (
        <div className="about-us">
            <Typography variant="h4" component="h1" gutterBottom>
                About Us
            </Typography>
            <hr/>
            <Typography variant="h5" component="h2">
                Election Prediction Research
            </Typography>
            <Typography variant="body1" paragraph>
                Led by Dr. Can Dogan from Radford University, this project uses advanced machine learning algorithms to predict election results. It analyzes historical data and voter demographics to provide accurate forecasts.
            </Typography>
            <Typography variant="body1" paragraph>
                [add summary of the research and study]
            </Typography>
            <Typography variant="body1" paragraph>
                Learn more about Dr. Dogan's work and publications on his <Link href="https://webapps.radford.edu/eprofiles/profile/page/cdogan" target="_blank" rel="noopener">faculty page</Link>.
            </Typography>
            <hr/>
            <Typography variant="h5" component="h2" gutterBottom>
                Website Development Team
            </Typography>
            <Typography variant="body1" paragraph>
                This user-friendly platform was developed by a dedicated team of Virginia Tech students:
            </Typography>
            <Typography variant="body1" component="li" gutterBottom>
                Pierre Tran
            </Typography>
            <Typography variant="body1" component="li" gutterBottom>
                Danny Pham
            </Typography>
            <Typography variant="body1" component="li" gutterBottom>
                Bryan Tran
            </Typography>
            <Typography variant="body1" component="li" gutterBottom>
                Eunice Hong
            </Typography>
            <Typography variant="body1" component="li" gutterBottom>
                Danny Chung
            </Typography>
            <Typography variant="body1"  paragraph>
                This project is part of a capstone for the Computer Science program at Virginia Tech. The team is responsible for the design, development, and deployment of the website.
            </Typography>
        </div>
    );
};

export default AboutUs;
