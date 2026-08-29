const adminAuth = (req, res, next)=>{
    const token = "admin";
    const isAuthorised = token === "admin";
    if(!isAuthorised){
        res.status(401).send("Unauthorized Request!")
    }
    else{
        next();
    }
}

const userAuth = (req, res, next)=>{
    const token = "user";
    const isAuthorised = token === "user";
    if(!isAuthorised){
        res.status(401).send("Unauthorized Request!")
    }
    else{
        next();
    }
}

module.exports = {adminAuth, userAuth};