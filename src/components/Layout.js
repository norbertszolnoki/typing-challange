import React from 'react';
import { Box } from '@mui/material';
import backgroundSvg from '../assets/images/2bjr1q8r8r4pn.svg';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      bgcolor: '#f8fafc',
      backgroundImage: `url(${backgroundSvg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '80%',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0.2), rgba(248, 250, 252, 0.4))',
        zIndex: 0
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 