let validation = require('../models/validation');
let userManager = require('../models/userModel');
let verifManager = require('../models/verificationModel');
let chalk = require('chalk');
const bcrypt = require('bcrypt');
const profileManager = require('../models/profileModel');
const util = require('../models/functions');

const User = {
    getUserAllInfos: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const userId = req.query.id
        const selectedUser = await profileManager.getUserProfile(userId);
            if (selectedUser) {
                if (selectedUser[0].born_date !== null)
                    selectedUser[0].age = util.calculateAge(selectedUser[0].born_date);
                else
                    selectedUser[0].age = null;
                console.log(chalk.red(JSON.stringify(selectedUser[0])))
                responseData.user = selectedUser[0];
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error, Please try again!';
            }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    userProfileStatut: async (req, res) => {
        // verify if user exists and if his profile is completed 
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const userID = req.query.id
        // verify user exists
        let user = await verifManager.verifyUserExists(userID);
        if (user[0].count === 0) {
            responseData.isValid = false;
            responseData.errorMessage.error= "This user does not exist!";
        } else {
            // verify the user profile is completed
            let completeProfile = await verifManager.verifyProfileComplete(userID);
            if (completeProfile[0].complete === 0) {
                responseData.errorMessage.error= "This user didn't complete his profile yet!";
            } else {
                responseData.successMessage = 'profile completed';
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getRelation: async (req, res) => {
        let responseData = {
            isValid : true,
            likesMessage: null,
            isLiked: 0,
            errorMessage: {}
        };
        let iLiked, iGotLiked;
        const otherUserId = req.query.id
        const connectedUserDataID = req.userData['userId'];
        let checkLike = await userManager.checkLikeRelation(connectedUserDataID, otherUserId);
        console.log(chalk.yellow(JSON.stringify(checkLike)))
        if (checkLike.length > 0) {
            checkLike.forEach(user => {
                if (user.liker_user_id == connectedUserDataID && user.liked_user_id == otherUserId) {
                    iLiked = 1;
                    responseData.isLiked = 1;
                }
                if (user.liker_user_id == otherUserId && user.liked_user_id == connectedUserDataID) {
                    iGotLiked = 1
                }
            });
            if (iLiked && iGotLiked) 
                responseData.likesMessage = 'You\'re matched'
            else if (iLiked)
                responseData.likesMessage = 'You liked this user'
            else if (iGotLiked)
                responseData.likesMessage = 'This user likes you'
        } else {
            responseData.message = 'No relationship!';
        }
        //console.log(chalk.blue(JSON.stringify(checkLike)))
        res.status(200).send(responseData);
    },
    likeUser: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const likedUserId = req.query.id
        const likerUserData = req.userData;
        // check block
        let checkBlock = await userManager.checkBlock(likerUserData['userId'], likedUserId);
        if (checkBlock.length > 0) {
            responseData.isValid = false;
            responseData.errorMessage.error= "You can't like or unlike this user!";
        } else {
            // check if liked or not
            let checkLike = await userManager.checkLiked(likerUserData['userId'], likedUserId);
            liker_user_id = likerUserData['userId'];
            liked_user_id = likedUserId;
            if (checkLike.length > 0) {
                // dislike the user
                let delLike = await userManager.deleteLike(liker_user_id, liked_user_id);
                if (delLike) {
                    responseData.successMessage = 'Like deleted successfully';
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error, Please try again!';
                }
            } else {
                // like the user
                let addLike = await userManager.addLike({liker_user_id, liked_user_id});
                if (addLike) {
                    responseData.successMessage = 'Like added successfully';
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error, Please try again!';
                }
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    }
}

module.exports = User