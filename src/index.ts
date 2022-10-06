import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose'
import bodyParser from 'body-parser';
import { userRouter } from './routes/user'
import { taskRouter } from './routes/task'
import { bucketRouter } from './routes/bucket'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRouter)
app.use(taskRouter)
app.use(bucketRouter)

mongoose.connect('mongodb://localhost:27017/jira-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions)
.then(() => console.log("Database connected successfully."))
.catch(err => console.log("Something went wrong Database connection.", err))

app.listen(3000, () => {
  console.log('server is listening on port 3000')
})