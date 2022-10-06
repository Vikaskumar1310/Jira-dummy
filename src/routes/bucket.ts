import express, { Request, Response } from 'express'
import { Task } from '../../models/task'
import { Bucket } from '../../models/bucket'

const router = express.Router()

router.get('/getAll/bucket', async (req: Request, res: Response) => {
    try {
        const bucket = await Bucket.find({})
        console.log('inside find all bucket', bucket);
        if (bucket.length <= 0) {
            return res.status(400).send({ message: `NO bucket present!` })
        }
        return res.status(200).send(bucket)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.get('/get/bucket/:id', async (req: Request, res: Response) => {
    try {
        const bucketId = req.params.id;

        const isBucketExists = await Bucket.findOne({ _id: bucketId });
        console.log('inside find single bucket', isBucketExists );
        if (!isBucketExists) {
            return res.status(400).send({ message: `bucket is not Present!` })
        }

        return res.status(200).send(isBucketExists)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.post('/create/bucket', async (req: Request, res: Response) => {
    try {
        const { bucket_name } = req.body;
        console.log('inside create bucket', req.body);

        const isBucketExists = await Bucket.findOne({ bucket_name });
        if (isBucketExists) {
            return res.status(400).send({ bucket: isBucketExists, message: `bucket with name: ${bucket_name} is already present!` })
        }

        const bucket = new Bucket({ bucket_name })
        await bucket.save()
        return res.status(201).send(bucket)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.post('/move/task/bucket', async (req: Request, res: Response) => {
    try {
        const { bucket_name, taskId } = req.body;
        console.log('inside move task to bucket', req.body);

        const bucket = await Bucket.findOne({ bucket_name });
        if (!bucket) {
            return res.status(400).send({ message: `bucket with name: ${bucket_name} is not present!` })
        }

        let task = await Task.findById({ _id: taskId });
        if (!task) {
            return res.status(400).send({ message: `task with id: ${taskId} is not present!` })
        }
        
        if(String(bucket._id) === String(task.assignedBucketId)){
            return res.status(400).send({ message: `This bucket is already assigned to this task id` })
        }

        if(task && task.assignedBucketId){
            const previousBucket = await Bucket.updateOne({_id: task.assignedBucketId}, {"$pull": { taskId: taskId } });
            console.log('update bucket', previousBucket);            
        }

        const updateTask = await Task.findOneAndUpdate({_id: taskId}, { assignedBucketId: bucket._id });
        console.log('updated task', updateTask);
        
        const updateBucket = await Bucket.findOneAndUpdate({ bucket_name }, { "$push": { taskId: taskId } })
        return res.status(200).send({bucket: updateBucket, task: updateTask})
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.delete('/delete/bucket/:id', async (req: Request, res: Response) => {
    try {
        const bucketId = req.params.id;

        const bucket = await Bucket.findById({ _id: bucketId });
        console.log('inside delete bucket', bucket);
        if (!bucket) {
            return res.status(400).send({ message: `bucket with id: ${bucketId} is not present!` })
        }

        if(bucket && bucket.taskId && bucket.taskId.length){
            let tasks = bucket.taskId;
            tasks.forEach(async (tsk)=>{
              console.log('task name', tsk);
              let updateTask = await Task.findOneAndUpdate({ _id: tsk }, { assignedBucketId: null })
              console.log('task db update', updateTask);              
            })
          }
        
        let deleteBucket = await Bucket.deleteOne({ _id: bucketId })
        return res.status(201).send({bucket: deleteBucket})
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

export { router as bucketRouter }