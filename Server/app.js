import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/connection.js'
import passport from 'passport'
import userRoutes from './routes/userRoutes.js'
import "../Server/config/passport_jwt_startegy.js"
const app = express()
const port = process.env.PORT
const DATABASE_URL=process.env.DATABASE_URL

// This will solve CORS error
const corsOptions = {
    // set origin to a specific origin
    origin: process.env.Frontend_HOST,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions))

// Database Connection
connectDB(DATABASE_URL)
// JSON
app.use(express.json())

// Passprt Middleware
app.use(passport.initialize())

// cookie-parser
app.use(cookieParser())

// Load Routes
app.use("/api/user",userRoutes)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);

})