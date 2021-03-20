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

const get = async(req,res) => {
    try{
        let { page, limit, ...filter } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const result = await EventService.read(page,limit,filter)
        console.log(result)
        const totalItems = await EventService.getTotalNumber(filter);
        return res.json({result: result, totalItems: totalItems})
    }
    catch (err) {
        return res.json({err})
    }
}

const interact = async(req,res) => {
    try{
        const user_id = req.user.id
        const event_id = req.params.id
        console.log("user_id",user_id)
        console.log("event_id",event_id)
    }
    catch (err) {
        return res.json({err})
    }
}

const remove = async(req,res) => {
    try{
        const host_id = Types.ObjectId(req.user.id)
        const event_id = Types.ObjectId(req.params.id)
        const event = await EventService.read(1,1,{_id: event_id}) 
        if (parseInt(event[0].host) === parseInt(host_id)) {
            await EventService.remove({_id: event_id})
            return res.json({msg:"Deleted this event"})
        }
        else {
            return res.json({msg:"User is not permission"})
        }
    }
    catch (err) {
        return res.json({err})
    }
}

export default {
    create,
    get,
    interact,
    remove
}