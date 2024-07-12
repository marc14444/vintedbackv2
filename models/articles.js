import { Schema, model } from "mongoose"

const userArticles = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    image: { 
        type: String, 
        required: [true, "Veuillez ajouter une image"] 
    },
    categorie: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    prix: {
        type: Number,
        required: true,
    }

})

export default model("Articles", userArticles)