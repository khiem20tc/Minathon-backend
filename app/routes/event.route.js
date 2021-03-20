import { Router } from "express";
import { EventController } from "../controllers"
import { checkAuth } from "../middlewares/"

var router = Router()

router.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
      });

router.post('/create', checkAuth, EventController.create)

router.get('/get', EventController.get)

export default router
