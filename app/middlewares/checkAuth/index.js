//const { verifyToken } = require('../../utils')
import { jwt } from "../../utils"

// const checkAuth = async (req, res, next, role) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1]
//         const decode = await verifyToken(token)
//         if (role && decode.role !== role) {
//             return res.status(401).json({
//                 message: 'User dont have permission'
//             })
//         }
//         req.user = decode
//         next()
//     } catch (error) {
//         return res.status(401).json({
//             message: 'Token is invalid'
//         })
//     }
// }

const checkAuth = async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decode = await jwt.verifyToken(token)
            req.user = decode
            next()
        } catch (error) {
            return res.status(401).json({
                message: 'Token is invalid'
            })
        }
    }

module.exports = {
    checkAuth
}