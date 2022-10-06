import mongoose from 'mongoose'

interface ITask {
    task_name: String;
    userId: mongoose.Schema.Types.ObjectId;
    assignedBucketId: mongoose.Schema.Types.ObjectId;
}

interface taskModelInterface extends mongoose.Model<TaskDoc> {
    build(attr: ITask): TaskDoc
}

interface TaskDoc extends mongoose.Document {
    task_name: String;
    userId: mongoose.Schema.Types.ObjectId;
    assignedBucketId: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    assignedBucketId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bucket'
    }
})

taskSchema.statics.build = (attr: ITask) => {
    return new Task(attr)
}

const Task = mongoose.model<TaskDoc, taskModelInterface>('Task', taskSchema)

export { Task }