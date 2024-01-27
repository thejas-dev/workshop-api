
let dataBase = {
    'Ramesh':['BMW','Audi','Thar','Jaguar'],
    'Vignesh':['Thar','Jaguar','Tesla'],
    'Suresh':['Audi','Tesla']
}

let userDatabase = {
    'thejas@gmail.com':'1234'
}

// Javascript Object Notation - JSON

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const server = express();

server.use(cors())
server.use(express.json());

function getHandler(request,response){
    console.log(request.params.name);
    const name = request.params.name;
    if(dataBase[name]){
        response.status(200);
        response.send({
            dataBase:dataBase[name]
        })
    }else{
        response.status(404);
        response.send({
            dataBase:undefined
        });
    }
}

function postHandler(request,response){
   
    const bodyData = request.body;
    if(dataBase[bodyData.name]){
        response.status(400);
        response.send({
            status:false,
            msg:"ALready exists!"
        })
    }else{
        dataBase[bodyData.name] = bodyData.cars
        response.status(200);
        response.send({
            status:true,
            msg:"Ok"
        })
    }
    
}

function deleteHandler(request,response){
    const name = request.params.name;
    if(dataBase[name]){
        delete dataBase[name]
        response.status(200);
        response.send({status:true})
    }else{
        response.status(404);
        response.send({status:false})
    }
}

function updateHandler(request,response){
    const bodyData = request.body;
    if(dataBase[bodyData.name]){
        dataBase[bodyData.name] = bodyData.cars;
        response.status(200);
        response.send({status:true});
    }else{
        response.status(404);
        response.send({status:false})
    }
}

function loginHandler(request,response){
    const bodyData = request.body;
    console.log(bodyData);
    if(userDatabase[bodyData.email]){
        if(userDatabase[bodyData.email] === bodyData.password){
            const payload = {
                email:bodyData.email,
                password:bodyData.password
            }
            const secretKey = 'this_is_a_secret'
            const expiresIn = {
                expiresIn:86400
            }
            const token = jwt.sign(payload,secretKey,expiresIn)
            console.log(token);
            response.status(200);
            response.send({status:true,token});
        }else{
            response.status(400);
            response.send({status:false,msg:"Wrong credentials!"})
        }
    }else{
        response.status(404);
        response.send({status:false});
    }
}

function middleware(request,response,next){
    const bodyData = request.body;
    if(bodyData.authToken){
        jwt.verify(bodyData.authToken,'this_is_a_secret',(error,decode)=>{
            if(error){
                response.status(400);
                response.send({status:false,msg:"Error!"})
            }else{
                next();
            }
        })

    }else{
        response.status(400);
        response.send({status:false,msg:"AUth token missing!"})
    }
}

server.get('/:name',getHandler);
server.post('/',middleware,postHandler);
server.delete('/:name',deleteHandler);
server.put('/',middleware,updateHandler);
server.post('/login',loginHandler);

function callBackFunc(){
    console.log("Server started on port 3333");
}

server.listen('3333',callBackFunc)

module.exports = server;