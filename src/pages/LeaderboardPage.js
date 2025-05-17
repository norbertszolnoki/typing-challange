import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Layout from '../components/Layout';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h1" component="h1" sx={{ color: 'primary.main' }}>
              Leaderboard
            </Typography>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'background.default',
                },
              }}
            >
              Back to Home
            </Button>
          </Box>

          <Leaderboard />
        </Box>
      </Container>
    </Layout>
  );
};

export default LeaderboardPage; 