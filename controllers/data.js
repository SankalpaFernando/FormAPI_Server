const { DataModel, CollectionModel } = require("../db");
const moment = require("moment-timezone");

async function postData(collectionName, data) {
    try{
        
        const collection = await CollectionModel.findOne({name: collectionName});
        console.log(collection)
        if(!collection){
            throw new Error("Collection not found");
        }
        const newdata = new DataModel({
            collectionID: collection._id,
            data: JSON.stringify(data),
            createdAt: moment().tz('UTC'),
            updatedAt: moment().tz('UTC')
        })
        await newdata.save();
    }catch(e){
        console.log(e)
    }
}

async function getData(collectionName,page) {
    try{
        const collection = CollectionModel.findOne({name: collectionName});
        if(!collection){
            throw new Error("Collection not found");
        }
        const data = DataModel.find({collectionID: collection._id}).skip(page*10).limit(10);
        return data;
    }catch(e){
        console.log(e)
    }
}

async function getDataByCollectionID(collectionID,page) {
    try{
        const collection = await CollectionModel.findById(collectionID);
        if(!collection){
            throw new Error("Collection not found");
        }
        const data = await DataModel.paginate({collectionID: collection._id},{page,limit:10});
        return data;
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    postData,
    getData,
    getDataByCollectionID
}