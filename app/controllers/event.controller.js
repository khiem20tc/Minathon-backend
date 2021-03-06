import { EventService, UserService } from "../services"
import { Types } from 'mongoose'
const { EventEntity, participant } = require('../models');

const create = async(req,res) => {
    try {
    let {
        place_id,
        date,
        time,
        address,
        district,
        title,
        category,
        max,
        hostNumberPhone,
        description,
        keywords,
    } = req.body
    const host = Types.ObjectId(req.user.id)
    let participant_subschema
    const event = {
        place_id,
        date,
        time,
        address,
        district,
        title,
        category,
        max,
        host,
        hostNumberPhone,
        description,
        keywords,
        participant_subschema
    }
    await EventService.create(event)
    let new_event = await EventService.readDetail(1,1,{date,
        time,
        address})
    new_event = new_event[0]
    await UserService.updateUser(
        { _id: host },
        { $push: { myEvent: new_event._id } }
    )
    //console.log(new_event)
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

const getDetail = async(req,res) => {
    try{
        let { page, limit, ...filter } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const result = await EventService.readDetail(page,limit,filter)
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
        const event = await EventService.readDetail(1,1,{_id: event_id})
        let i  
       
        for(i=0;i<event[0].participant_subschema.length;i++){
            if(parseInt(event[0].participant_subschema[i].user)==parseInt(user_id)){
                return res.json({msg: "You requested this event and cant request duplicate"})
            }
        }
        if (event[0].status===false){
        await EventService.update(
            { _id: event_id },
            { $push: { participant_subschema: {user: user_id} } }
         )
        await UserService.updateUser(
            { _id: user_id },
            { $push: { myEvent: event_id } }
        )
            return res.json({msg: "Requested"})
        }
        else {
            return res.json({msg: "This event was reach max persion number"})
        }
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
        const event = await EventService.readDetail(1,1,{_id: event_id})
        if (parseInt(event[0].host._id) === parseInt(host_id)) {
            let participantList = event[0].participant_subschema
            let i
            let number_persion = 0
            for (i=0;i<participantList.length;i++) {
                if (participantList[i].isAccepted===true){
                    number_persion++
                }
            }
            if(event[0].status===true || (parseInt(number_persion)>=parseInt(event[0].max))){
                return res.json({msg: "You cant accpet more than max number persion"})
            }
            for (i=0;i<participantList.length;i++) {
                // if (parseInt(number_persion)<parseInt(event[0].max)) console.log("true")
                // else {console.log("false")}
                // console.log(participantList[i].user)
                // console.log(user_id)
                if(parseInt(participantList[i].user)===parseInt(user_id) && (parseInt(number_persion)<parseInt(event[0].max))){
                    participantList[i].isAccepted = true
                }
                // else {
                //     return res.json({msg: "This user is not request your event"})
                // }
            }
            await EventService.update(
                { _id: event_id },
                { participant_subschema: participantList
            }
             )
             //block new request to join when number accepted persion is max
            number_persion = 0
            for (i=0;i<participantList.length;i++) {
                if (participantList[i].isAccepted===true){
                    number_persion++
                }
            }
            if (parseInt(number_persion)===parseInt(event[0].max)) {
                await EventService.update(
                    { _id: event_id },
                    {  status: true}
                 )
            }
            return res.json({msg: "Done. Please check your result again"})
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
        const event = await EventService.readDetail(1,1,{_id: event_id})
        if (parseInt(event[0].host._id) === parseInt(host_id)) {
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

const getMyListEvent = async(req,res) => {
    try{
        const {page,limit} = req.query
        const id = req.user.id
        const user = await UserService.readUser(1,1,{_id: id})
        let final_event = []
        let i 
        for (i=0;i<user[0].myEvent.length;i++){
            //console.log(user[0].myEvent[i])
            let event = await EventService.readDetail(1,1,{_id: user[0].myEvent[i]})
            //console.log(event[0])
            let d = new Date(JSON.stringify(event[0].date))
            let today = new Date()
            if ((parseInt(today.getDate()) - parseInt(d.getDate()) < 1) && ((parseInt(today.getHours()) - parseInt(event[0].time)) < 1) ){
                        let participantList
                        participantList = event[0].participant_subschema
                        let j
                        for(j=0;j<event[0].participant_subschema.length;j++){
                            let user = await UserService.readUser(1,1,{_id: Types.ObjectId(event[0].participant_subschema[j].user)})
                            participantList[j].phoneNumber = user[0].phoneNumber
                            await EventService.update(
                                { _id: event[0]._id },
                                { participant_subschema: participantList
                                }
                            )
                        }
                    }
            //console.log(user[0].myEvent[i])
            let event_element = await EventService.readDetail(1,1,{_id: user[0].myEvent[i]})
            //console.log(event_element[0])
            let isAccept = false
            let k
            for (k=0;k<event[0].participant_subschema.length;k++){
                if(event[0].participant_subschema[k]==user[0]._id)
                isAccept = true
            }
            // console.log(event[0].host._id)
            // console.log(id)
            if (event[0].host._id == id || isAccept)
            {
                final_event.push(event_element[0])
            }
            else {
                final_event.push({
                    place_id: event_element[0].place_id,
                    _id: event_element[0]._id,
                    date: event_element[0].date,
            time: event_element[0].time,
            address: event_element[0].address,
            district: event_element[0].district,
            title: event_element[0].title,
            category: event_element[0].category, 
            max: event_element[0].max,
            host: event_element[0].host,
            description: event_element[0].description,
            keywords: event_element[0].keywords,
                })
            }
            
        }
        return res.json({final_event,totalItems: final_event.length})
    }
    catch (err) {
        return res.json({err})
    }
}

const getDetailInfo = async(req,res) => {
    try{
        const _id = req.params.id
        const result = await EventService.getDetailInfo(_id)
        return res.json(result)
    }
    catch(err){
        return res.json({err})
    }
}

export default {
    create,
    get,
    getDetail,
    interact,
    accept,
    remove,
    getMyListEvent,
    getDetailInfo
}