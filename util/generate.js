const { default: mongoose } = require("mongoose");
const { LogModel } = require("../db");


const bson = mongoose.mongo.BSON
const stats = LogModel.find().lean().exec().then((logs) => {
    var docsBsonSize = bson.calculateObjectSize(logs);
    console.log(docsBsonSize)
})

console.log(stats)