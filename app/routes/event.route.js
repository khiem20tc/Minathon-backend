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

router.get('/getDetail', EventController.getDetail)

//put
router.post('/interact/:id', checkAuth, EventController.interact)

//put
router.post('/accept/:id', checkAuth, EventController.accept)

router.delete('/delete/:id', checkAuth, EventController.remove)

router.get('/getMyListEvent', checkAuth, EventController.getMyListEvent)

router.get('/getDetailInfo/:id', checkAuth, EventController.getDetailInfo)

export default router
