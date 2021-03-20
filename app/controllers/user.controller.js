import { UserService } from "../services"
import { bcrypt, jwt } from "../utils"
import { cloudinary } from "../services"

// const { generateToken, verifyToken, hashPassword, comparePassword } = require('../utils')

const signUp = async (req, res) => {
    try {
        const {firstName,lastName,birthday,gender,
            address,username,phoneNumber,password} = req.body
        const hashedPassword = await bcrypt.hashPassword(password)
        const new_user = {
            firstName,
            lastName,
            birthday,
            gender,
            address,
            username,
            password: hashedPassword,
            phoneNumber
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
    try {
        let {oldPassword, newPassword} = req.body
        const id_user = req.user.id
        const user = await UserService.readUser(1,1,{_id: id_user})
        const isMatch = await bcrypt.comparePassword(oldPassword, user[0].password)
        if (isMatch) {
            let newhashedPassword = await bcrypt.hashPassword(newPassword)
            await UserService.updateUser({_id: id_user},{password: newhashedPassword})
            return res.json({msg: "Change your password succesfully"})
        }
        else {
            return res.json({msg: "Cant change your password. Please try again!!"})
        }
    }
    catch (err) {

    }
}

const setAvt = async (req,res) => {
    try {
    let {icon} = req.body
    let id = req.user.id
    console.log(id)
    if (icon) {
        let uploadIcon = null;
        try {
          uploadIcon = await cloudinary.upload(icon, {
            // public_id: `Icon_${symbols}`,
            // upload_preset: "network_icon",
          });
        } catch (error) {
            res.json({msg: err});
        }
    
        icon = uploadIcon.url;
        await UserService.updateUser(id,icon)
        return res.json(icon)
      }
    return res.json({icon})
    }
    catch (err) {
        res.json({msg: err});
    }
}

const updateInfo = async(req,res) => {
    try{
        let {phoneNumber, aboutMe} = req.body
        const id_user = req.user.id
        await UserService.updateUser({_id: id_user},{phoneNumber, aboutMe})
        return res.json({msg: "Update your info succefully"})
    }
    catch(err){
        res.json({msg: err});
    } 
}

const getInfo = async(req,res) => {
    try {
        const id = req.params.id
        const user = await UserService.readUser(1,1,{_id: id})
        return res.json({
            username: user[0].username,
            avatar: user[0].avatar,
            aboutMe: user[0].aboutMe
        })
    }
    catch (err) {
        res.json({msg: err});
    }
}

const getMe = async(req,res) => {
    try{
        const id = req.user.id
        const user = await UserService.readUser(1,1,{_id: id})
        return res.json(user[0])
    }
    catch(err){
        res.json({msg: err});
    }
}

export default {
    signUp,
    signIn,
    changePwd,
    setAvt,
    updateInfo,
    getInfo,
    getMe,
}