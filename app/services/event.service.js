const { EventEntity, participant } = require('../models');

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
        .sort({_id: -1})
        .skip(page * limit - limit)
        .limit(limit)
        .lean();
    let i
    let new_result = []
    for (i=0;i<result.length;i++){
        new_result.push({
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
        .sort({_id: -1})
        .skip(page * limit - limit)
        .limit(limit)
        .lean();
    return result
    } catch (err){
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
    getTotalNumber
}