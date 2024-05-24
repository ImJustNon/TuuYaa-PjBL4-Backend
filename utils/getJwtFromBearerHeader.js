module.exports = {
    getJwtFromBearerHeader: async(req) =>{
        const bearerHeader = await req.headers["authorization"];
        if(typeof bearerHeader === "undefined"){
            return false;
        }

        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        return bearerToken;
    }
}