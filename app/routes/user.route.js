import { Router } from "express";
import { UserController } from "../controllers"
import { checkAuth } from "../middlewares"

var router = Router()

router.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
      });

router.post('/signup', UserController.signUp)

router.post('/signin', UserController.signIn)

router.put('/changepwd', checkAuth, UserController.changePwd)

export default router
