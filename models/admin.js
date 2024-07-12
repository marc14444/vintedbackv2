import {Schema, model} from "mongoose"

const AdminSchema = new Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
      },
      prenom: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      motDePasse: {
        type: String,
        required: true,
      },
})

export default model('Admin', AdminSchema)