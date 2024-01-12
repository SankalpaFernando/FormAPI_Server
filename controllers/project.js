const { default: mongoose } = require('mongoose');
const {ProjectModel, CollectionModel, DataModel} = require('../db');

async function getProjects(userID){
    try{
        const projects = await ProjectModel.find({userID});
        return projects;
    }catch(e){
        console.log(e)
    }
}

async function getProject(id){
    try{
        const project = await ProjectModel.findById(id);
        return project;
    }catch(e){
        console.log(e)
    }
}

async function createProject(userID,name){
    try{
        const project = new ProjectModel({
            userID,
            name,
            timeZone:"gmt"
        })
        await project.save();
        return project;
    }catch(e){
        console.log(e)
    }
}
// {name: String, key: String, permissions: String}

async function addApiKey(id,apiKey){
    try{
        const project = await ProjectModel.findById(id);
        apiKey.disable = false;
        project.apiKeys.push(apiKey);
        await project.save();
        return project;
    }catch(e){
        console.log(e)
    }
}

async function deleteApiKey(id,apiKeyID){
    try{
        const project = await ProjectModel.findById(id);
        project.apiKeys = project.apiKeys.filter((key)=>key._id != apiKeyID);
        await project.save();
        return project;
    }catch(e){
        console.log(e)
    }
}

async function updateApiKeyPermission(id,apiKeyID,permission){
    try{
        const project = await ProjectModel.findById(id);
        project.apiKeys = project.apiKeys.map((key)=>{
            if(key._id == apiKeyID){
                key.permission = permission;
            }
            return key;
        })
        await project.save();
        return project;
    }catch(e){
        console.log(e)
    }
}

async function toggleDisableApiKey(id,apiKeyID){
    try{
        const project = await ProjectModel.findById(id);
        project.apiKeys = project.apiKeys.map((key)=>{
            if(key._id == apiKeyID){
                key.disable = !key.disable ;
            }
            return key;
        })
        await project.save();
        return project;
    }catch(e){
        console.log(e)
    }
}

async function updateProject(id,project){
    try{
        const oldProject = await ProjectModel.findById(id);
        oldProject.name = project.name;
        oldProject.timeZone = project.timeZone;
        await oldProject.save();
        return oldProject;

    }catch(e){
        console.log(e)
    }
}

async function archiveProject(id){
    try{
        const project = await ProjectModel.findById(id);
        project.archived = !project.archived;
        await project.save();
        return project;
    }catch(e){
        console.log(e)
    }
}

async function deleteProject(id){
    try{
        const project = await ProjectModel.findById(id);
        await project.deleteOne()
        return project;
    }catch(e){
        console.log(e)
    }
}


async function getProjectStats(projectID){
    try{
        const bson = mongoose.mongo.BSON
        const collections = await CollectionModel.find({projectID});
        let docSize = 0;
        let docCount = 0;
        let collectionCount = collections.length;

        
        for(const collection of collections){
            const stats = await DataModel.find({
                collectionID:collection._id
            }).lean().exec()

            docCount += stats.length
            docSize += bson.calculateObjectSize(stats)
        }
        
        return ({docSize,docCount,collectionCount})

    }catch(e){
        console.log(e)
    }

}

module.exports = {
    getProjects,
    createProject,
    getProject,
    addApiKey,
    deleteApiKey,
    updateApiKeyPermission,
    toggleDisableApiKey,
    updateProject,
    archiveProject,
    deleteProject,
    getProjectStats
}