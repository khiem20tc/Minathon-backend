//const mongoose = require('mongoose')
import mongoose from 'mongoose'
//const { MONGO_URL } = require('../../environments')
import { MONGO_URL } from '../../environments'

const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
  	useFindAndModify: false,
  	autoIndex: false,
}

mongoose.Promise = global.Promise

mongoose.connect(MONGO_URL, connectionOptions)

mongoose.set('debug', true)

//module.exports = { mongoose }

export default mongoose 