import { EventService } from "../services"
import { Types } from 'mongoose'

const create = async(req,res) => {
    try {
    let {
        date,
        time,
        address,
        district,
        title,
        category,
        max,
        description,
        keywords,
    } = req.body
    const host = Types.ObjectId(req.user.id)
    let participant_subschema 
    const event = {
        date,
        time,
        address,
        district,
        title,
        category, 
        max,
        host,
        description,
        keywords,
        participant_subschema
    }
    await EventService.create(event)
    let new_event = await EventService.read(1,1,{date,
        time,
        address})
    new_event = new_event[0]
    console.log(new_event)
        return res.json(new_event)
    } catch (err) {
        return res.json({err})
    }
}

const get = async(req,res) => {}

export default {
    create,
    get
}