import mongoose from 'mongoose'

interface IUser {
  first_name: String;
  last_name: String;
  email: String;
  phone_number: String;
  task: String[];
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc
}

interface UserDoc extends mongoose.Document {
  first_name: String;
  last_name: String;
  email: String;
  phone_number: String;
  task: String[];
}

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone_number: {
    type: String,
    trim: true
  },
  task: {
    type: [String],
  }
})

userSchema.statics.build = (attr: IUser) => {
  return new User(attr)
}

const User = mongoose.model<UserDoc, userModelInterface>('User', userSchema)

export { User , IUser}