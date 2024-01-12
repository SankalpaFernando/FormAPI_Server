const { Schema } = require('mongoose');


const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
});

const ProjectSchema = new Schema({
    name: String,
    timeZone: String,
    apiKeys: [{key_name: String, key: String, permission: String, disable: Boolean}],
    archived: Boolean,
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
})

const CollectionSchema = new Schema({
    projectID: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    name: String,
})

const DataSchema = new Schema({
    collectionID:{
        type: Schema.Types.ObjectId,
        ref: "Collection"
    },
    data: String

},{timestamps: true})


const LogSchema = new Schema({
    projectID: Schema.Types.ObjectId,
    type: String,
},{timestamps: true})


module.exports = {
    UserSchema,
    ProjectSchema,
    CollectionSchema,
    DataSchema,
    LogSchema
};