async function rootController(req, res){
    return res.json({
        status: "OK",
    });
}


module.exports = {
    rootController
}