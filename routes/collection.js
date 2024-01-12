const { Router } = require('express');
const { getCollection, createCollection, getLogsByTime, getCollectionSize } = require('../controllers/collection');
const { getData, getDataByCollectionID } = require('../controllers/data');

const router = Router();

router.use((req,res,next)=>{
    console.log(req.session)
    if(req.session.user){
        next();
    }else{
        res.json([])
    }
});

router.get('/:projectID/all',async (req,res)=>{
    try{
        const projectID = req.params.projectID;
        const collections = await getCollection(projectID);
        res.json(collections);
    }catch(e){
        console.log(e)
    }
})

router.post('/:projectID/create',async (req,res)=>{
    try{
        const projectID = req.params.projectID;
        const {name} = req.body;
        const collection = await createCollection(projectID,name);
        res.json(collection);
    }catch(e){
        console.log(e)
    }
})

router.get('/:projectID/:collectionID/data',async (req,res)=>{
    try{
        const {collectionID} = req.params;
        const {page} = req.query;
        const collections = await getDataByCollectionID(collectionID,page);
        res.json(collections);
    }catch(e){
        console.log(e)
    }
})

router.get('/logs/:projectID',async (req,res)=>{
    try{
        const {projectID} = req.params;
        const logs = await getLogsByTime(projectID);
        res.json(logs);
    }catch(e){
        console.log(e)
    }
})

router.get('/size/:projectID',async (req,res)=>{
    try{
        const {projectID} = req.params;
        const size = await getCollectionSize(projectID);
        res.json(size);
    }catch(e){

    }
})

module.exports = router;