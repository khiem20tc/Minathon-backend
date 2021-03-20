import { Router } from "express";
import { UserController } from "../controllers"
import { checkAuth } from "../middlewares/"

var router = Router()

router.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
      });

router.post('/signup', UserController.signUp)

router.post('/signin', UserController.signIn)

router.put('/changepwd', checkAuth, UserController.changePwd)

router.put('/setAvt', checkAuth, UserController.setAvt)

router.put('/updateInfo', checkAuth, UserController.updateInfo)

router.get('/getInfo/:id', checkAuth, UserController.getInfo)

router.get('/getMe', checkAuth, UserController.getMe)

export default router
