const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // User routes
const sessionRoutes = require('./routes/sessionRoutes'); // Session routes
const codeRoutes = require('./routes/codeRoutes'); 
const loginRoutes = require('./routes/loginRoutes'); 
const cashLogsRoutes = require('./routes/cashLogsRoutes'); 
const editSessionRoutes = require('./routes/editSessionRoutes'); // Edit session routes
const { connectDb } = require('./config/db'); // Database connection
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (like CSS, JS, images)
app.use(express.static('public'));

// Serve static files from the "pricing" directory
app.use('/pricing', express.static(path.join(__dirname, 'pricing')));

// Set EJS as the view engine
app.set('view engine', 'ejs');


// Use cookie-parser to parse cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Route to show an MP4 video centered on a black background at the root URL
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Video</title>
            <style>
                body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: black;
                }
                video {
                    max-width: 30vw;
                    max-height: 100%;
                }
            </style>
        </head>
        <body>
            <video src="/assets/animation.mp4" autoplay muted loop></video>
        </body>
        </html>
    `);
});

// Use routes
app.use('/users', userRoutes); // User-related routes (registration, login)
app.use('/sessions', sessionRoutes); // Session-related routes (creating and listing sessions)
app.use('/codes', codeRoutes); // Session-related routes (creating and listing sessions)
app.use('/login', loginRoutes); // Session-related routes (creating and listing sessions)
app.use('/cashlogs', cashLogsRoutes); // Session-related routes (creating and listing sessions)
app.use('/edit', editSessionRoutes); // Edit session routes
app.use('/tournament', require('./routes/tournamentRoutes')); // Tournament routes

// Start the server
app.listen(PORT, async () => {
    // Connect to the MongoDB database
    await connectDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
