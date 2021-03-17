import { UserService } from "../services"
import { bcrypt, jwt } from "../utils"

// const { generateToken, verifyToken, hashPassword, comparePassword } = require('../utils')

const signUp = async (req, res) => {
    try {
        const {username,password} = req.body
        const hashedPassword = await bcrypt.hashPassword(password)
        const new_user = {
            username: username,
            password: hashedPassword
        };
        const user = await UserService.readUser(1,1,{username: new_user.username})
        if (!user[0]) {
            await UserService.createUser(new_user)
            res.status(200).json(new_user);
        }
        else res.status(400).json({msg: 'User is already exist'});
    } catch(err) {
        res.json({msg: err});
    }
}
const signIn = async (req, res) => {
    try {
        const {username,password} = req.body
        const user = await UserService.readUser(1,1,{username: username})
        if (!user[0]) {
            return res.json({msg: "User is not exist"})
        }
        else {
            if (await bcrypt.comparePassword(password, user[0].password)){
                const token = await jwt.generateToken(user[0])
                console.log(token)
                return res.json({token: token, user: user[0]})}
            else {
                return res.json({msg: "Wrong password. Please try again"})
            }
        }
    }
    catch (err) {
        res.json({msg: err});
    }
}
const changePwd = async (req, res) => {
    res.json(req.user)
}

export default {
    signUp,
    signIn,
    changePwd
}