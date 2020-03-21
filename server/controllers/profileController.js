let validation = require('../models/validation');
let authManager = require('../models/authentificationModel');
let tokenManager = require('../models/autorizationModel');
let verifManager = require('../models/verificationModel');
let chalk = require('chalk');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('../models/mailModel');
const profileManager = require('../models/profileModel');
const jwt = require("jsonwebtoken");
const util = require('../models/functions');

const Profile = {
    editBasic: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = {
            "userId": 23,
            "username":"hajar12",
            "email":"tabinoc939@newe-mail.com"
        }
        // get the form infos from the request body
        let { firstName, lastName, username, email, birthDay, gender, orientation, bio } = req.body;
        //console.log(chalk.redBright(typeof tags));
        // Validate First Name
        let err = validation.validate(firstName, "first Name", validation.isName);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.firstName = err;
        }
        // Validate Last Name
        err = validation.validate(lastName, "last Name", validation.isName);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.lastName = err;
        }
        // Validate Username
        err = validation.validate(username, "username", validation.isUsername);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.username = err;
        }
        // Validate Email
        err = validation.validate(email, "email", validation.isEmail);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.email = err;
        }
        // Validate Birth Day
        err = validation.validate(birthDay, "birthday", validation.isBirthDate);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.birthDay = err;
        }
        // Validate Gender
        err = validation.validate(gender, "gender", validation.isGender);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.gender = err;
        }
        // Validate Orientation
        err = validation.validate(orientation, "orientation", validation.isOrientation);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.orientation = err;
        }
        // Validate Biography 
        err = validation.validate(bio, "bio", validation.isBio);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.bio = err;
        } else
            bio = util.escapeHtml(bio.trim());
        // Validate Tags
        // tags = {
        //     0: 'tag1',
        //     1: 'tag2'
        // }
        // err = validation.isTags(tags);
        // if (err !== "success") {
        //     responseData.isValid = false;
        //     responseData.errorMessage.tags = err;
        // }

        if (responseData.isValid === true) {
            // Verify if new username & email does not exists already
            if (userData['username'] !== username) {
                const verifUsername = await verifManager.verifyUsernameExists(username);
                if (verifUsername[0].count !== 0) {
                    responseData.isValid = false;
                    responseData.errorMessage.username= "This username already exist, Please choose another one!";
                }
            }
            if (userData['email'] !== email) {
                const verifEmail = await verifManager.verifyEmailExists(email);
                if (verifEmail[0].count !== 0) {
                    responseData.isValid = false;
                    responseData.errorMessage.email= "This email already exist, Please choose another one!";
                } 
            }
        }

        // Update user basic infos
        if (responseData.isValid === true) {
            gender = Number(gender);
            orientation = Number(orientation)
            const updateUser = await profileManager.updatebasic(firstName, lastName, username, email, gender, orientation, birthDay, bio, userData['userId'])
            if (updateUser) {
                responseData.successMessage = "Your infos are updated successfully";
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error Updating your infos, Please try again!';
            }
        }

        // if (responseData.isValid === true) {
        //     // Creation of hashed password
        //     password = await bcrypt.hash(password, 10);
        //     // Creation of token
        //     let token = crypto.randomBytes(40).toString('hex');
        //     const register = await authManager.register({firstName, lastName, username, email, password, token});
        //     if (register) {
        //         // Send Activation MAIL
        //         const subject = 'Matcha: Account Activation';
        //         const content = `Hi ${username}, <br>Folow the link below to activate your account: 
        //         <a href='http://${process.env.HOST}:${process.env.PORT_FRONT}/activateAccount?token=${token}'>Link</a><br>`;
        //         const m = await mail.sendMail(email, subject, content);
        //         if (m) {
        //             responseData.successMessage = "Your Account has been created successfully, Please check your Email for the activation link";
        //         } else {
        //             responseData.isValid = false;
        //             responseData.errorMessage.error= 'Error Creating your account, Please try again!';
        //         }
        //     } else {
        //         responseData.isValid = false;
        //         responseData.errorMessage.error= 'Error Creating your account, Please try again!';
        //     }
        // }
        if (responseData.isValid === true)
            res.status(201).send(responseData);
        else
            res.status(400).send(responseData);
    },
}

module.exports = Profile;