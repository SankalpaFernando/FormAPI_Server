const mongoose = require('mongoose');
require('dotenv').config();

const { 
    UserSchema,
    ProjectSchema,
    CollectionSchema,
    DataSchema,
    LogSchema
} = require('./schema');
const url = process.env.MONGODB_URI 


async function run (){
    mongoose.connect(url)
    .then(()=>console.log("DB Connected"))
    .catch((err)=>console.log(err))
}

run()


const UserModel = mongoose.model('User', UserSchema);
const ProjectModel = mongoose.model('Project', ProjectSchema);
const CollectionModel = mongoose.model('Collection', CollectionSchema);
DataSchema.plugin(require('mongoose-paginate-v2'))
const DataModel = mongoose.model('Data', DataSchema);
const LogModel = mongoose.model('Log', LogSchema);



module.exports = {
    UserModel,
    ProjectModel,
    CollectionModel,
    DataModel,
    LogModel
}