import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.middleware.js';
import http from 'http';




const app = express();

// CORS configuration
const allowedOrigins = ['https://tagobuy.net'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static("public"));
app.use('/images', express.static('images'));
app.use('/images/photos', express.static('images/photos'));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Welcome to TagoBot Server V:1.0');
});

// Import routes
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import serviceRouter from './routes/service.routes.js';
import scheduleRouter from './routes/schedule.routes.js';
import credentialRouter from './routes/credential.routes.js';
import postLogRouter from './routes/postlog.routes.js';




// Route declaration
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use('/services', serviceRouter);
app.use('/schedules', scheduleRouter);
app.use('/credentials', credentialRouter);
app.use('/postlogs', postLogRouter);







// Error middleware should be used after all routes
app.use(errorMiddleware);





export { app };
