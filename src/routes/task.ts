import express, { Request, Response } from 'express'
import { Task } from '../../models/task'
import { User } from '../../models/user'

const router = express.Router()

router.get('/getAll/task', async (req: Request, res: Response) => {
    try {
        const task = await Task.find({})
        console.log('inside find all task', task);
        if (task.length <= 0) {
            return res.status(400).send({ message: `NO task present!` })
        }
        return res.status(200).send(task)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.get('/get/task', async (req: Request, res: Response) => {
    try {
        const { task_name } = req.body;

        console.log('inside find single task', task_name);
        const isTaskExists = await Task.findOne({ task_name });
        if (!isTaskExists) {
            return res.status(400).send({ message: `task with name: ${task_name} is not Present!` })
        }

        return res.status(200).send(isTaskExists)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.post('/create/task', async (req: Request, res: Response) => {
    try {
        const { task_name } = req.body;
        console.log('inside create task', req.body);

        const isTaskExists = await Task.findOne({ task_name });
        if (isTaskExists) {
            return res.status(400).send({ task: isTaskExists, message: `task with name: ${task_name} is already present!` })
        }

        const task = new Task({ task_name })
        await task.save()
        return res.status(201).send(task)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.post('/assign/task', async (req: Request, res: Response) => {
    try {
        const { task_name, email } = req.body;
        console.log('inside assign task to user', req.body);

        const isTaskExists = await Task.findOne({ task_name });
        if (!isTaskExists) {
            return res.status(400).send({ message: `task with name: ${task_name} is not present!` })
        }

        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ message: `User with email: ${email} is not present!` })
        }
        
        if(user && user.task && user.task.indexOf(task_name)>=0 ){
            return res.status(400).send({ message: `This task is already assigned to this user email` })
        }

        if(isTaskExists && isTaskExists.userId ){
            let deleteTaskFromUser = await User.updateOne({_id: isTaskExists.userId}, {"$pull": { task: task_name } });
            console.log('Task unassigned from user', deleteTaskFromUser);
        }

        const updateUser = await User.findOneAndUpdate({ email }, { "$push": { task: task_name } })
        console.log('updated usr', updateUser);
        
        const updateTask = await Task.findOneAndUpdate({ task_name }, { userId: user._id })
        return res.status(200).send({task: updateTask, user: updateUser})
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

router.delete('/delete/task', async (req: Request, res: Response) => {
    try {
        const { task_name } = req.body;
        console.log('inside delete task', req.body);

        const isTaskExists = await Task.findOne({ task_name });
        if (!isTaskExists) {
            return res.status(400).send({ message: `task with name: ${task_name} is not present!` })
        }

        console.log('task detail', isTaskExists);
        
        let deleteTaskFromUser = await User.updateOne({_id: isTaskExists.userId}, {"$pull": { task: task_name } })

        let task = await Task.deleteOne({ task_name })
        return res.status(201).send({task, user: deleteTaskFromUser})
    } catch (error) {
        return res.status(500).send({ error: error })
    }
})

export { router as taskRouter }