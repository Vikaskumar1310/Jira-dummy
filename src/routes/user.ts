import express, { Request, Response } from 'express'
import { User } from '../../models/user'
import { Task } from '../../models/task'

const router = express.Router()

//Get All users
router.get('/getAll/user', async (req: Request, res: Response) => {
  try {
    const user = await User.find({})
    console.log('inside find all user', user);
    if(user.length <= 0) {
      return res.status(400).send({ message: `Users not present!`})
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send({ error: error  })
  }
})

//Get single user
router.get('/get/user', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if(!user) {
      return res.status(400).send({ message: `User with email: ${req.body.email} is not Present!`})
    }

    console.log('inside find single user', user);

    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send({ error: error  })
  }
})

//Create user
router.post('/create/user', async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone_number } = req.body;
    console.log('inside create user', req.body);

    const isUserExists = await User.findOne({ email: req.body.email });
    if(isUserExists){
        return res.status(400).send({user: isUserExists, message: `User with email: ${req.body.email} is already registered!`})
    }

    const user = new User({ first_name, last_name, email, phone_number })    
    await user.save()    
    return res.status(201).send(user)
  } catch (error) {
    return res.status(500).send({ error: error  })
  }
})

//update user 
//we can update user by Id also, by sending Id in params
router.patch('/update/user', async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone_number } = req.body;
    console.log('inside update user', req.body);

    const isUserExists = await User.findOne({ email: req.body.email });
    if(!isUserExists){
        return res.status(400).send({ message: `User with email: ${req.body.email} Not present!`})
    }
    const user = await User.findOneAndUpdate({ email },{ first_name, last_name, phone_number });
    return res.status(201).send(user)
  } catch (error) {
    return res.status(500).send({ error: error  })
  }
})

//delete user
//we can delete user by Id also, by sending Id in params
router.delete('/delete/user', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('inside delete user', req.body);

    const isUserExists = await User.findOne({ email: req.body.email });
    if(!isUserExists){
        return res.status(400).send({ message: `User with email: ${req.body.email} Not present!`})
    }

    if(isUserExists && isUserExists.task && isUserExists.task.length){
      let tasks = isUserExists.task;
      tasks.forEach(async (tsk)=>{
        console.log('task name', tsk);
        let updateTask = await Task.findOneAndUpdate({ task_name: tsk }, { userId: null })
        console.log('task db update', updateTask);
        
      })
    }

    const user = await User.deleteOne({ email });
    return res.status(201).send(user)
  } catch (error) {
    return res.status(500).send({ error: error  })
  }
})

export { router as userRouter }