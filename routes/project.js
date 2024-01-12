const { Router } = require('express')
const router = Router();
const { getProjects,createProject,getProject, addApiKey, deleteApiKey, updateApiKeyPermission, toggleDisableApiKey,updateProject, archiveProject,deleteProject, getProjectStats } = require('../controllers/project');


router.use((req,res,next)=>{
    if(req.session.user){
        next();
    }else{
        res.json([])
    }
});

router.get('/all',async (req,res)=>{
    try{
        const projects = await getProjects(req.session.user._id);
        res.json(projects);
    }catch(e){
        console.log(e)
    }
})

router.get('/:id',async (req,res)=>{
    try{
        const project = await getProject(req.params.id);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.post('/create',async (req,res)=>{
    try{
        const {name} = req.body;
        const project = await createProject(req.session.user._id,name);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.post('/:id/apikey',async (req,res)=>{
    try{
        const {key_name,key,permission} = req.body;
        const project = await addApiKey(req.params.id,{key_name,key,permission});
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.delete('/:id/apikey/:keyID',async (req,res)=>{
    try{
        const project = await deleteApiKey(req.params.id,req.params.keyID);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.put('/:id/apikey/:keyID/update',async (req,res)=>{
    try{
        const project = await updateApiKeyPermission(req.params.id,req.params.keyID,req.body.permission);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.put('/:id/apikey/:keyID/disable',async (req,res)=>{
    try{
        const project = await toggleDisableApiKey(req.params.id,req.params.keyID);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.put('/:id/update',async (req,res)=>{
    try{
        const project = await updateProject(req.params.id,req.body);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.put('/:id/archive',async (req,res)=>{
    try{
        const project = await archiveProject(req.params.id);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.delete('/:id',async (req,res)=>{
    try{
        const project = await deleteProject(req.params.id);
        res.json(project);
    }catch(e){
        console.log(e)
    }
})

router.get('/:projectID/stats',async (req,res)=>{
    try{
        const projectID = req.params.projectID;
        const stats = await getProjectStats(projectID);
        res.json(stats);
    }catch(e){
        console.log(e)
    }
})

module.exports = router;