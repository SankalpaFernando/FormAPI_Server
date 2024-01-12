const { default: mongoose } = require('mongoose')
const { CollectionModel, LogModel, DataModel } = require('../db')

async function getCollection(projectID) {
    try {
        const collections = await CollectionModel.find({ projectID })
        return collections
    } catch (e) {
        console.log(e)
    }
}

async function createCollection(projectID, name) {
    try {
        const collection = new CollectionModel({
            projectID,
            name:name.toLowerCase(),
        })
        await collection.save()
        return collection
    } catch (e) {
        console.log(e)
    }
}

async function getLogsByTime(projectID){
    try{
        const writeLogs = await LogModel.aggregate([
            { 
                $match: { 
                    "type": "write",
                    "projectID": new mongoose.Types.ObjectId(projectID)

                 } 
            },          
            {
                $group:{
                    _id:{
                        $dateToString: { format: "%Y-%m-%d %H", date: "$createdAt" }
                    },
                    count:{$sum:1},
                }
            }
        ])

        const readLogs = await LogModel.aggregate([
            { 
                $match: { 
                    "type": "read",
                    "projectID": new mongoose.Types.ObjectId(projectID)

                 } 
            },          
            {
                $group:{
                    _id:{
                        $dateToString: { format: "%Y-%m-%d %H", date: "$createdAt" }
                    },
                    count:{$sum:1},
                }
            }
        ])
        return ({
            writeLogs,
            readLogs
        });

    }catch(e){
        console.log(e)
    }
}


async function getCollectionSize(projectID){
    try{
        const bson = mongoose.mongo.BSON
        const collections = await CollectionModel.find({projectID});
        var size = 0;
        await collections.forEach(async (collection)=>{
                const stats = await DataModel.find({
                    collectionID:collection._id
                }).lean().exec()
                size += bson.calculateObjectSize(stats)

        })
        
        return ({projectSize:size})

    }catch(e){
        console.log(e)
    }

}

module.exports = {
    getCollection,
    createCollection,
    getLogsByTime,
    getCollectionSize
}