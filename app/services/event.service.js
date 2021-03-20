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
    update,
    remove,
    getTotalNumber
}