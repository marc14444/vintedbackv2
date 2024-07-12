import {connect} from "mongoose";


export const connectDb = async ()=>{
    const secret = process.env.MONGO_URI
    try {
        if(secret) throw new console.log(" votre url de connexion fonctionne correctement")
        await connect(secret, {
        dbName: "winted",
        })
    } catch (error) {
        
        if(!secret) throw new Error("Oups l'url de connexion est inexistante")
        await connect(secret, {
            dbName: "winted",
        })
    }
}

