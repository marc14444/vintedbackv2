import User from "./../models/users.js"
import express from "express"
import bcrypt, { hash, compare, genSalt } from "bcrypt"
import jwt from "jsonwebtoken"

//d'abodr creer une class pour tous les elements du controllers
class userControllers {

    //creer un utilisateur
    static async createUser(req, res) {
        // const salt = await genSalt(10)

        const { email, motDePasse, name, prenom, ...body } = req.body
        console.log(req.body);
        if (!email || !motDePasse || !name || !prenom) return res.status(400).json({ statut: false, message: "les champs sont pas oblibagtoire" })
        const exist = await User.findOne({ email })
        console.log("newUser exist", exist);
        if (exist) {
            console.log("exist", exist);
            return res.status(400).json({ statut: false, message: "ce mail existe deja" })
        }
        /* const HashmotDePasse = await hash(motDePasse, 10) */
        req.body.motDePasse = await bcrypt.hash(motDePasse, 10)
        const newUser = await User.create(req.body)
        /* const newUser = await User.create({
            email,
            motDePasse: HashmotDePasse,
            ...body
        }) */
        console.log(newUser);
        /*  if (!newUser) {
             console.log("newUser",newUser);
             return res.status(400).json({ statut: true, message: "New user non créé" })
         } */

        res.status(200).json({ statut: true, message: newUser })
    }
    //supprimer un utilisateur
    static async deleteUser(req, res) {
        const _id = req.params.id;
        console.log(req.params)
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).json({ statut: false, message: "Ce user n'existe pas" })
        }
        const deleteUser = await User.deleteOne({ _id })
        if (!deleteUser) {
            return res.status(400).json({ statut: false, message: "Erreur lors de la supression" })
        }
        res.status(204).json({ statut: true, message: "supprimé avec succès" })

    }
    //modifier un utilisateur
    static async updateUser(req, res) {
        const _id = req.params.id
        const user = await User.findById(_id)
        const { ...body } = req.body
        if (!user) {
            return res.status(400).json({ statut: false, message: "Ce user n'existe pas" })
        }

        const updateUser = await User.updateOne({ _id }, { ...body })

        if (!updateUser) {
            return res.status(400).json({ statut: false, message: "Erreur lors de la modifiaction" })
        }

        res.status(201).json({ statut: true, message: "Bien modifié !!!" })
    }
    //recuperer un utilisateur
    static async getUser(req, res) {
        const _id = req.params.id

        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).json({ statut: false, message: "Erreur lors de la recuperation" })
        }

        res.status(200).json({ statut: true, message: user })
    }
    //recuperer tous les utilisateur
    static async getAll(req, res) {
        const getUser = await User.find()
        if (!getUser.length) {
            return res.status(203).json({ statut: false, message: "aucun element n'a été trouver" })
        }
        res.status(201).json({ statut: true, message: getUser, total: getUser.length })
    }
    //connecter l'utilisateur
    static async login(req, res) {
        try {
            const { email, motDePasse } = req.body;
            const userLogin = await User.findOne({ email });

            if (!userLogin) {
                return res.status(404).json({ statut: false, message: `user ${email} non trouvé` })
            }
            if (!email === userLogin.email || !await compare(motDePasse, userLogin.motDePasse)) {
                res.status(404).json({ statut: false, message: ` Identifiant ${email} invalide` })
                return
            }
            res.status(200).json({
                statut: true,
                token: jwt.sign(userLogin.toObject(), "mon code", { expiresIn: 3600 * 24 }),
                message: userLogin
            })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }

    }
}

export default userControllers