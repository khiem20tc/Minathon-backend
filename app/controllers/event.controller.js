import { EventService } from "../services"
import { Types } from 'mongoose'
const { EventEntity, participant } = require('../models');

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
        const totalItems = await EventService.getTotalNumber(filter);
        return res.json({result: result, totalItems: totalItems})
    }
    catch (err) {
        return res.json({err})
    }
}

const interact = async(req,res) => {
    try{
        const user_id = Types.ObjectId(req.user.id)
        const event_id = Types.ObjectId(req.params.id)
        await EventService.update(
            { _id: event_id },
            { $push: { participant_subschema: {user: user_id} } }
         )
        return res.json({msg: "Requested"})
    }
    catch (err) {
        return res.json({err})
    }
}

const accept = async(req,res) => {
    try {
        const host_id = Types.ObjectId(req.user.id)
        const event_id = Types.ObjectId(req.params.id)
        const user_id = Types.ObjectId(req.query.user_id)
        const event = await EventService.read(1,1,{_id: event_id}) 
        if (parseInt(event[0].host) === parseInt(host_id)) {
            let participantList = event[0].participant_subschema
            let i 
            for (i=0;i<participantList.length;i++) {
                let number_persion = 0
                if (participantList[i].isAccepted===true){
                    number_persion++
                }
                if (parseInt(number_persion)<parseInt(event[0].max)) console.log("true")
                else {console.log("false")}
                if(parseInt(participantList[i].user)===parseInt(user_id) && (parseInt(number_persion)<parseInt(event[0].max))){
                    participantList[i].isAccepted = true
                }
            }
            await EventService.update(
                { _id: event_id },
                { participant_subschema: participantList,
                        status: true
            }
             )
             return res.json({msg: "OK"})
        }
        else {
            return res.json({msg:"User is not permission"})
        }
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
    accept,
    remove
}