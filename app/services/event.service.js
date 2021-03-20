const { EventEntity } = require('../models');

const create = async(data) => {
    try{
        await UserEntity.create(data)
    } catch (err) {
        return err
    }
}

const read = async(page,limit,filter) => {
    try{
    let result = await UserEntity.find(filter)
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
        await UserEntity.updateOne(filter,update)
    } catch (err) {
        return err
    }
}

const remove = async(filter) => {
    try{
        await UserEntity.deleteOne(filter)
    } catch (err) {
        return err
    }
}

export default {
    create,
    read,
    update,
    remove
}