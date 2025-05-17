import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Layout from '../components/Layout';
import Leaderboard from '../components/Leaderboard';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
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
              Gridly Typing Challenge
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<LeaderboardIcon />}
                onClick={() => navigate('/leaderboard')}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'background.default',
                  },
                }}
              >
                Leaderboard
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/new-game')}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                New Game
              </Button>
            </Box>
          </Box>

          <Leaderboard />
        </Box>
      </Container>
    </Layout>
  );
};

export default HomePage; 