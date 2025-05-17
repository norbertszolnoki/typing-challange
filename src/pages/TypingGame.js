import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from '../components/Layout';

const TypingGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [cps, setCps] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalTypos, setTotalTypos] = useState(0);
  const [totalCharactersTyped, setTotalCharactersTyped] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const previousInputLength = useRef(0);

  // Fetch sentences when component mounts
  useEffect(() => {
    const fetchSentences = async () => {
      const sentencesViewId = process.env.REACT_APP_GRIDLY_SENTENCES_VIEW_ID;
      const apiKey = process.env.REACT_APP_GRIDLY_API_KEY;

      if (!sentencesViewId || !apiKey) {
        console.error('Missing environment variables:', {
          viewId: sentencesViewId,
          hasApiKey: !!apiKey
        });
        setError('Configuration error. Please check environment variables.');
        setSnackbarOpen(true);
        return;
      }

      try {
        const response = await fetch(`https://api.gridly.com/v1/views/${sentencesViewId}/records`, {
          headers: {
            'Authorization': `ApiKey ${apiKey}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch sentences');
        }

        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No sentences available');
        }

        // Get a random sentence from the response
        const randomIndex = Math.floor(Math.random() * data.length);
        const sentence = data[randomIndex].cells[0].value;
        setTargetText(sentence);
      } catch (error) {
        console.error('Error fetching sentences:', error);
        setError(error.message || 'Failed to load sentences. Please try again.');
        setSnackbarOpen(true);
      }
    };

    fetchSentences();
  }, []);

  const handleInputChange = (e) => {
    if (gameComplete) return;
    
    const newInput = e.target.value;
    setUserInput(newInput);
    setCursorPosition(e.target.selectionStart);
    
    // Track total characters typed (only count new characters)
    const newChars = newInput.length - previousInputLength.current;
    if (newChars > 0) { // Only count positive additions (new characters)
      setTotalCharactersTyped(prev => prev + 1); // Count one new character at a time
    }
    previousInputLength.current = newInput.length;
    
    if (!startTime && newInput.length > 0) {
      setStartTime(Date.now());
    } else if (startTime) {
      // Calculate current CPS using total characters typed
      const timeElapsed = (Date.now() - startTime) / 1000; // in seconds
      const newCps = Math.round((totalCharactersTyped / timeElapsed) * 10) / 10;
      setCps(newCps);
    }
    
    // Calculate current errors (for display only)
    let newErrors = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] !== targetText[i]) {
        newErrors++;
      }
    }
    setErrors(newErrors);

    // If space is pressed, check if the word was typed correctly
    if (newInput.endsWith(' ')) {
      const lastWord = newInput.trim().split(' ').pop();
      const targetWords = targetText.split(' ');
      const currentWordIndex = newInput.trim().split(' ').length - 1;
      
      if (lastWord !== targetWords[currentWordIndex]) {
        // Only increment total typos when a word is completed incorrectly
        setTotalTypos(prev => prev + 1);
      }
    }
    
    // Calculate accuracy based on completed words
    const completedWords = newInput.trim().split(' ').length;
    const totalWords = targetText.split(' ').length;
    const newAccuracy = Math.round(((totalWords - totalTypos) / totalWords) * 100);
    setAccuracy(newAccuracy);
    
    // Check if game is complete
    if (newInput === targetText) {
      const finalEndTime = Date.now();
      setEndTime(finalEndTime);
      const finalTimeElapsed = (finalEndTime - startTime) / 1000;
      const finalCps = Math.round((totalCharactersTyped / finalTimeElapsed) * 10) / 10;
      setCps(finalCps);
      setGameComplete(true);
      setShowResults(true);
    }
  };

  const handleSelect = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const handleRestart = () => {
    const fetchNewSentence = async () => {
      try {
        const response = await fetch(`https://api.gridly.com/v1/views/${process.env.REACT_APP_GRIDLY_SENTENCES_VIEW_ID}/records`, {
          headers: {
            'Authorization': `ApiKey ${process.env.REACT_APP_GRIDLY_API_KEY}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch new sentence');
        }

        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        const sentence = data[randomIndex].cells[0].value;
        setTargetText(sentence);
      } catch (error) {
        console.error('Error fetching new sentence:', error);
        setError('Failed to load new sentence. Please try again.');
        setSnackbarOpen(true);
      }
    };

    fetchNewSentence();
    setUserInput('');
    setCursorPosition(0);
    setStartTime(null);
    setEndTime(null);
    setCps(0);
    setAccuracy(100);
    setGameComplete(false);
    setErrors(0);
    setTotalTypos(0);
    setTotalCharactersTyped(0);
    previousInputLength.current = 0;
    setShowResults(false);
  };

  const submitToGridly = async () => {
    try {
      const timeElapsed = (endTime - startTime) / 1000;
      const response = await fetch(`https://api.gridly.com/v1/views/${process.env.REACT_APP_GRIDLY_VIEW_ID}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `ApiKey ${process.env.REACT_APP_GRIDLY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            cells: [
              {
                columnId: "firstName",
                value: userData.firstName
              },
              {
                columnId: "lastName",
                value: userData.lastName
              },
              {
                columnId: "email",
                value: userData.email
              },
              {
                columnId: "jobTitle",
                value: userData.jobTitle
              },
              {
                columnId: "companyName",
                value: userData.companyName
              },
              {
                columnId: "cps",
                value: cps
              },
              {
                columnId: "accuracy",
                value: accuracy
              },
              {
                columnId: "time",
                value: timeElapsed
              },
              {
                columnId: "numofchars",
                value: targetText.length
              }
            ]
          }
        ])
      });

      if (!response.ok) {
        throw new Error('Failed to submit results');
      }

      navigate('/');
    } catch (error) {
      console.error('Error submitting results:', error);
      setError('Failed to submit results. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleGoHome = () => {
    if (showResults) {
      submitToGridly();
    } else {
      navigate('/');
    }
  };

  const handleCloseDialog = () => {
    setShowResults(false);
  };

  const handleCloseError = () => {
    setSnackbarOpen(false);
  };

  const renderText = () => {
    const chars = targetText.split('');
    return chars.map((char, index) => {
      let color = 'inherit';
      if (index < userInput.length) {
        color = userInput[index] === char ? 'green' : 'red';
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  const renderInput = () => {
    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onSelect={handleSelect}
          spellCheck="false"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '18px',
            fontFamily: 'monospace',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            caretColor: 'black',
            textDecoration: 'none',
            outline: 'none',
            boxShadow: 'none'
          }}
          autoFocus
        />
      </Box>
    );
  };

  if (!targetText) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Typography>Loading...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

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
            }}
          >
            <Typography variant="h1" component="h1" sx={{ color: 'primary.main' }}>
              Typing Challenge
            </Typography>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Submit
            </Button>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">CPS</Typography>
                <Typography variant="h4">{cps.toFixed(1)}</Typography>
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">Accuracy</Typography>
                <Typography variant="h4">{accuracy}%</Typography>
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">Errors</Typography>
                <Typography variant="h4">{errors}</Typography>
              </Paper>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  color: 'text.primary',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                {renderText()}
              </Typography>
            </Box>
            <Box
              sx={{
                fontSize: '1.2rem',
                lineHeight: 1.8,
                fontFamily: 'monospace',
                position: 'relative',
              }}
            >
              {renderInput()}
            </Box>
          </Paper>

          <Dialog
            open={showResults}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 60, color: 'gold' }} />
              </Box>
              <Typography variant="h4">Congratulations!</Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Your Typing Results
                </Typography>
                <Typography variant="h6">Characters Per Second: {cps.toFixed(1)}</Typography>
                <Typography variant="h6">Accuracy: {accuracy}%</Typography>
                <Typography variant="h6">Total Typos: {totalTypos}</Typography>
                <Typography variant="h6">Time: {((endTime - startTime) / 1000).toFixed(1)} seconds</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleRestart}
                sx={{ mr: 2 }}
              >
                Play Again
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleGoHome}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={6000} 
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </Layout>
  );
};

export default TypingGame; 