# Typing Challenge Leaderboard

A web application that displays a real-time leaderboard for typing challenge results, powered by Gridly.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (includes npm)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Steps

1. **Install Node.js**
   - Visit [Node.js website](https://nodejs.org/)
   - Download and install the LTS (Long Term Support) version
   - Verify installation by opening a terminal/command prompt and running:
     ```
     node --version
     npm --version
     ```

2. **Clone the Repository**
   - Download and extract the project files to your local machine
   - Open a terminal/command prompt
   - Navigate to the project directory

3. **Install Dependencies**
   - In the project directory, run:
     ```
     npm install
     ```

## Configuration

1. **Create Environment File**
   - In the project root directory, create a new file named `.env`
   - Add the following content:
     ```
     REACT_APP_GRIDLY_VIEW_ID=your_view_id_here
     REACT_APP_GRIDLY_API_KEY=your_api_key_here
     REACT_APP_GRIDLY_SENTENCES_VIEW_ID=your_sentences_view_id_here
     ```

2. **Get Gridly Credentials**
   - Log in to your [Gridly account](https://app.gridly.com/)
   - Navigate to your view
   - Copy the View ID from the URL or view settings
   - Generate an API key from your account settings
   - Replace `your_view_id_here` and `your_api_key_here` in the `.env` file with your actual credentials

## Running the Application

1. **Start the Development Server**
   - In the project directory, run:
     ```
     npm start
     ```
   - The application will open automatically in your default web browser
   - If it doesn't open automatically, visit `http://localhost:3000`

2. **Building for Production**
   - To create a production build, run:
     ```
     npm run build
     ```
   - The build files will be created in the `build` folder

## Troubleshooting

- If you encounter any issues during installation, ensure Node.js is properly installed
- Make sure all environment variables are correctly set in the `.env` file
- Check that your Gridly API key has the necessary permissions
- Ensure your Gridly view contains the required columns: firstName, lastName, cps, accuracy, time, numofchars, and total

## Support

For issues related to:
- Gridly configuration: Contact Gridly support
- Application setup: Open an issue in the project repository 
