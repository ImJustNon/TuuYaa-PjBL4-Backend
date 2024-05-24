const tokenLength = 64;
const crypto = require('crypto');

module.exports = {
    createToken: (mode) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(tokenLength, async(error, buffer) =>{
                if(error){
                    console.log(error);
                }
                if(mode === "native"){
                    resolve("N_" + buffer.toString('hex'));
                }
                else if(mode === "google"){
                    resolve("G_" + buffer.toString('hex'));
                }
            });
        });
    }
}