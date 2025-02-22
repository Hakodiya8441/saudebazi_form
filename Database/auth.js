function middleware(req,resp,next){
    const head = "Bearer saudebazi";
    // const token = req.headers.keys;
    const token = req.headers.authorization;
    console.log(token);
    if(!token){
        return resp.status(404).json(console.log("header is not there"))
    }
    else if(token != head){
        return resp.status(404).json(console.log("header not matched"))
    }
    else if(token == head){
        return next()
    }
    else{
        console.log("nahi hua")
    }
}

module.exports = middleware

