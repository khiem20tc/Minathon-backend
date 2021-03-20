const create = async(req,res) => {
    let {
        date,
        time,
        address,
        district,
        name,
        category,
        max,
        description,
        keywords,
    } = req.body
    
}

const get = async(req,res) => {}

export default {
    create,
    get
}