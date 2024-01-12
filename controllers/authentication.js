const { UserModel } = require('../db/'); 
const bcrypt = require('bcrypt');

async function register(name,password,email){
    try{
        password = await bcrypt.hash(password, 10);
        const user = new UserModel({
            name,
            email,
            password
        })
        await user.save()
        return user;
    }catch(e){
        console.log(e)
    }
}


async function login(email,password){
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            throw new Error("User not found")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error("Password not matching")
        }
        delete user.password;
        return user;
    }catch(e){
        console.log(e)
    }   
}

module.exports = {
    register,
    login
}