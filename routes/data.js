const { Router } = require('express');
const { postData, getData } = require('../controllers/data');
const { ProjectModel, LogModel } = require('../db');
const moment = require('moment-timezone');
const router = Router();




router.use(async(req,res,next)=>{
    console.log(req.headers)
    try{
        const {api_key,project_id} = req.headers;
        if(!api_key || !project_id){
            res.json({success:false,message:"Api key and project id required"})
            return;
        }

        if(!project_id.match(/^[0-9a-fA-F]{24}$/)){
            res.json({success:false,message:"Project id is not valid"})
            return;
        }
    
        const project = await ProjectModel.findById(project_id);
        
        if(!project){
            res.json({success:false,message:"Project not found"})
            return;
        }
        const apiKey = project.apiKeys.find((key)=>key.key == api_key);
        if(!apiKey){
            res.json({success:false,message:"Api key not found"})
            return;
        }
        if(apiKey.disable){
            res.json({success:false,message:"Api key disabled"})
            return;
        }

        console.log(apiKey.permission!= "write" || apiKey.permission != "write-read")
    
        if(req.method == "POST" || req.method == "PUT" || req.method == "DELETE"){
            if(apiKey.permission != "write" && apiKey.permission != "read_write"){
                res.json({success:false,message:"Api key does not have permission to post"})
                return;
            }
        }else if(req.method == "GET"){
            if(apiKey.permission != "read" && apiKey.permission != "read_write"){
                res.json({success:false,message:"Api key does not have permission to get"})
                return;
            }
        }

        let type;
        if(req.method == "POST" || req.method == "PUT" || req.method == "DELETE"){
            type = "write";
        }else{
            type = "read";
        }

        const log = new LogModel({
            projectID:project_id,
            type,
        });

        await log.save();

        next();
    }catch(e){
        console.log(e)
    }

})

router.post('/:collection',async (req,res)=>{
    try{
        const {collection} = req.params;
        const {data} = req.body;
        await postData(collection,data);
        res.json({success:true});

        console.log(data)
    }catch(e){
        console.log(e)
    }
})

router.get('/:collection',async (req,res)=>{
    try{
        const {collection} = req.params;
        const {page} = req.query;
        const data = await getData(collection,page);
        res.json({success:true,data});
    }catch(e){
        console.log(e)
    }
})




module.exports = router;