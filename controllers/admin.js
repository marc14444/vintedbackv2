/* //admin controller

const express = require('express');
const router = express.Router();

// Get all admins

router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single admin

router.get('/:id', getAdmin, (req, res) => {
    res.json(res.admin);
});

// Create new admin

router.post('/', async (req, res) => {
    const admin = new Admin({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        motDePasse: req.body.motDePasse,
    });

    try {
        const newAdmin = await admin.save();
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update admin

router.patch('/:id', getAdmin, async (req, res) => {
    if (req.body.nom || req.body.prenom || req.body.email || req.body.motDePasse) {
        res.admin.nom = req.body.nom;
        res.admin.prenom = req.body.prenom;
        res.admin.email = req.body.email;
        res.admin.motDePasse = req.body.motDePasse;

        try {
            const updatedAdmin = await res.admin.save();
            res.json(updatedAdmin);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
});

// Delete admin

router.delete('/:id', getAdmin, async (req, res) => {
    try {
        await res.admin.remove();
        res.json({ message: 'Admin supprimé !' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get admin by ID

async function getAdmin(req, res, next) {
    let admin;

    try {
        admin = await Admin.findById(req.params.id);

        if (admin === null) {
            return res.status(404).json({ message: 'Admin non trouvé !' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.admin = admin;
    next();
}

module.exports = router;


 */
import jwt from "jsonwebtoken"
import Admin from "./../models/admin.js"
import bcrypt, { compare, genSalt } from "bcrypt"

class adminControllers{
    //create admin
    static async createAdmin(req, res) {
        const {email, motDePasse, nom, prenom, ...body} =req.body;
        console.log(req.body);
        if(!email || !motDePasse || !nom || !prenom )return res.status(400).json({ statut: false, message: "les champs sont oblibagtoire" })
        const exist = await Admin.findOne({ email })
        console.log("newAdmin exist", exist);
        if(exist) {
            console.log("exist", exist);
            return res.status(400).json({ statut: false, message: "ce mail existe deja" })
        }
        req.body.motDePasse = await bcrypt.hash(motDePasse, 10)
        const newAdmin = await Admin.create(req.body)
        console.log(newAdmin);
        res.status(200).json({statut: true, message: newAdmin})
    }
    //delete admin
    static async deleteAdmin(req, res){
        const _id = req.params.id;
        console.log(req.params)
        const admin = await Admin.findById(_id);
        if (!admin) {
            return res.status(400).json({ statut: false, message: "Ce admin n'existe pas" })
        }
        const deleteAdmin = await Admin.deleteOne({ _id })
        if (!deleteAdmin) {
            return res.status(400).json({ statut: false, message: "Erreur lors de la suppression" })
        }
        res.status(204).json({ statut: true, message: "supprimé avec succès" })
    }
    //update admin
    static async updateAdmin(req, res){
        const _id = req.params.id
        const admin = await Admin.findById(_id);
        const{...body} = req.body;
        if (!admin) {
            return res.status(400).json({ statut: false, message: "Ce admin n'existe pas" })
        }
        const updateAdmin = await Admin.findByIdAndUpdate({_id}, {...body});
        if (!updateAdmin) {
            return res.status(400).json({ statut: false, message: "Erreur lors de la modification" })
        }
        res.status(200).json({statut: true, message: "Bien modifié"})
    }
    //get one admin
    static async getAdmin(req, res){
        const _id = req.params.id
        const admin = await Admin.findById(_id);
        if(!admin){
            return res.status(400).json({ statut: false, message: "Ce admin n'existe pas" })
        }
        res.status(200).json({statut: true, message: admin})
    }
    //getAll admin
    static async getAll(req, res){
        const getAdmin = await Admin.find()
        if(!getAdmin.length){
            return res.status(203).json({ statut: false, message: "aucun admin n'a été trouvé" })
        }
        res.status(201).json({ statut: true, message: getAdmin, total: getAdmin.length })

    }
    //conneecter l'utilisateur
    static async loginAdmin(req, res){
            try{
                const {email, motDePasse} = req.body;
                const adminLogin = await Admin.findOne({email});

                if(!adminLogin) {
                    return res.status(404).json({ statut: false, message: `Admin ${email} non trouvé` })
                }
                if(!email === adminLogin.email || !await compare(motDePasse, adminLogin.motDePasse)){
                    res.status(404).json({ statut: false, message: `Identifiant ${email} invalide` })
                    return
                }
                res.status(200).json({
                    statut: true,
                    token: jwt.sign(adminLogin.toObject(),"mon code", {expires: 3600*24}),
                    message: `Vous êtes connecté avec succès ${adminLogin.nom} ${adminLogin.prenom}`,
                    admin: adminLogin
                })
            }catch(error){
                res.status(500).json({ statut: false, message: error.message })
            }
    } 
}
export default adminControllers