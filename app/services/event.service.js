const { EventEntity, participant } = require('../models');
import { Types } from 'mongoose'

const create = async(data) => {
    try{
        await EventEntity.create(data)
    } catch (err) {
        return err
    }
}

const read = async(page,limit,filter) => {
    try{
    let result = await EventEntity.find(filter)
        .populate('host')
        .sort({_id: -1})
        .skip(page * limit - limit)
        .limit(limit)
        .lean();
    let i
    let new_result = []
    for (i=0;i<result.length;i++){
        new_result.push({
            _id: result[i]._id,
            date: result[i].date,
            time: result[i].time,
            address: result[i].address,
            district: result[i].district,
            title: result[i].title,
            category: result[i].category, 
            max: result[i].max,
            host: result[i].host,
            description: result[i].description,
            keywords: result[i].keywords,
        })
    }
    return new_result
    } catch (err){
        return err
    }
}

const readDetail = async(page,limit,filter) => {
    try{
    let result = await EventEntity.find(filter)
        .populate('host')
        .sort({_id: -1})
        .skip(page * limit - limit)
        .limit(limit)
        .lean();
    return result
    } catch (err){
        return err
    }
}

const getDetailInfo = async (id) => {
    try{
        let event = await EventEntity.aggregate([
            { $match: {_id: Types.ObjectId(id)} },
            {
              $lookup:
              {
                from: "users",
                localField: "participant_subschema.user",
                foreignField: "_id",
                as: "userInfo"
              }
            },
            // {
            //     $unwind: "$network"
            // }
        ])
        let i
        let new_event = []  
        for(i=0;i<event.length;i++){
            let j
            let new_userInfo = []
            for (j=0;j<event[i].userInfo.length;j++){
                new_userInfo.push({
                    name: event[i].userInfo[j].firstName +" "+ event[i].userInfo[j].lastName,
                    aboutMe: event[i].userInfo[j].aboutMe,
                    avatar: event[i].userInfo[j].avatar
                })
            }
            new_event.push({
                    _id: event[i]._id,
                    status: event[i]._status,
                    date: event[i].date,
                    time: event[i].time,
                    address: event[i].address,
                    district: event[i].district,
                    title: event[i].title,
                    category: event[i].category,
                    max: event[i].max,
                    host: event[i].host,
                    description: event[i].description,
                    keywords: event[i].keywords,
                    participant_subschema: event[i].participant_subschema,
                    userInfo: new_userInfo
            })
        }
          return new_event;
    }
    catch(err) {
        return err
    }
}

const update = async(filter,update) => {
    try{
        await EventEntity.updateOne(filter,update)
    } catch (err) {
        return err
    }
}

const remove = async(filter) => {
    try{
        await EventEntity.deleteOne(filter)
    } catch (err) {
        return err
    }
}

const getTotalNumber = async(filter) => {
    try {
        const total = await EventEntity.countDocuments(filter)
        return total
    }
    catch (err) {
        return err
    }
}

export default {
    create,
    read,
    readDetail,
    update,
    remove,
    getTotalNumber,
    getDetailInfo
}