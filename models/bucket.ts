import mongoose from 'mongoose'

interface IBucket {
    bucket_name: String;
    taskId: mongoose.Schema.Types.ObjectId[];
}

interface bucketModelInterface extends mongoose.Model<BucketDoc> {
    build(attr: IBucket): BucketDoc
}

interface BucketDoc extends mongoose.Document {
    bucket_name: String;
    taskId: mongoose.Schema.Types.ObjectId[];
}

const bucketSchema = new mongoose.Schema({
    bucket_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    taskId:{
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Task'
    }
})

bucketSchema.statics.build = (attr: IBucket) => {
    return new Bucket(attr)
}

const Bucket = mongoose.model<BucketDoc, bucketModelInterface>('Bucket', bucketSchema)

export { Bucket }