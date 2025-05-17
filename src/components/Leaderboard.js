import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

const Leaderboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://api.gridly.com/v1/views/${process.env.REACT_APP_GRIDLY_VIEW_ID}/records`, {
          headers: {
            'Authorization': `ApiKey ${process.env.REACT_APP_GRIDLY_API_KEY}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        
        // Transform and sort the data
        const transformedData = data.map(record => {
          const cells = record.cells.reduce((acc, cell) => {
            acc[cell.columnId] = cell.value;
            return acc;
          }, {});
          
          return {
            firstName: cells.firstName,
            lastName: cells.lastName,
            cps: parseFloat(cells.cps),
            accuracy: parseFloat(cells.accuracy),
            time: parseFloat(cells.time),
            numofchars: parseInt(cells.numofchars),
            total: parseFloat(cells.total) // Use total from API instead of calculating
          };
        });

        // Sort by total score descending
        transformedData.sort((a, b) => b.total - a.total);
        
        setResults(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard. Please try again later.');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)' }}>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3, 
          fontFamily: 'monospace',
          bgcolor: 'background.default',
          p: 2,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        Score = ((TotalChars / TotalSeconds) × (Accuracy / 100)) × 10
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell align="right">CPS</TableCell>
              <TableCell align="right">Accuracy</TableCell>
              <TableCell align="right">Characters</TableCell>
              <TableCell align="right">Time (s)</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{result.firstName}</TableCell>
                <TableCell>{result.lastName}</TableCell>
                <TableCell align="right">{result.cps.toFixed(1)}</TableCell>
                <TableCell align="right">{result.accuracy}%</TableCell>
                <TableCell align="right">{result.numofchars}</TableCell>
                <TableCell align="right">{result.time.toFixed(1)}</TableCell>
                <TableCell align="right">{result.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard; 