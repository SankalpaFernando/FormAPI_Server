const { Router } = require('express')
const { register,login } = require('../controllers/authentication');
const router = Router()

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await register(name, password, email);
        res.json(user)
    } catch (e) {
        console.log(e)
    }
})

router.post('/login', async (req,res)=>{
    try{
        const { email, password} = req.body;
        const user = await login(email,password);
        if(user){
            req.session.user = user;
        }else{
            res.status(401);
            return res.json({message:"Invalid credentials"})
        }
        res.json({message:"Logged in",user});
    }catch(e){
        console.log(e)
    }
})

module.exports =  router;