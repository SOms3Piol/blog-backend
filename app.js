import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

const app = express()

app.use(cors({
    origin: '*'
}))

app.use(express.static("public"))
app.use(bodyParser.json())


//routes import
import userRouter from './routes/user.routes.js'
import blogRouter from "./routes/blog.routes.js"



//routes declaration
app.use("/api/users", userRouter);
app.use('/api/blog' , blogRouter);


// http://localhost:8000/api/v1/users/register

export { app }