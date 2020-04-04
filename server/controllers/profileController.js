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
        // get connected user data from token
        let userData = req.userData;
        // get the form infos from the request body
        let { firstName, lastName, username, email, birthDay, gender, orientation, bio } = req.body;
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
            const updateUser = await profileManager.updatebasic(firstName, lastName, username, email, gender, orientation, birthDay, bio, userData['userId'])
            if (updateUser) {
                responseData.successMessage = "Your infos are updated successfully";
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error Updating your infos, Please try again!';
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    updatePassword:  async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        let { oldPassword, newPassword, confirmPassword } = req.body;
        // Validate Old Password
        let err = validation.validate(oldPassword, "password", validation.isPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.oldPassword =  err;
        }
        // Validate New Password
        err = validation.validate(newPassword, "password", validation.isPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.newPassword =  err;
        }
        // Validate Password Confirmation
        err = validation.isConfirmPassword(newPassword, confirmPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.confirmPassword = err;
        }
        // Verify if the old password is correct
        if (responseData.isValid === true) {
             const user = await authManager.getUserInfos('id', userData['userId']);
             if (user[0]) {
                // Verify password is correct
                const match = await bcrypt.compare(oldPassword, user[0].password);
                if (match) {
                    // Creation of hashed password
                    let password = await bcrypt.hash(newPassword, 10);
                    const update = await profileManager.updatePassword(password, userData['userId'], 'id');
                    if (update) {
                        responseData.successMessage = "Your password has changed successfuly.";
                    } else {
                        responseData.isValid = false;
                        responseData.errorMessage.error = 'Error Updating your password, Please try again!';
                    }
                } else {
                    // Passwords don't match
                    responseData.isValid = false;
                    responseData.errorMessage.oldPassword = "Wrong Password!";
                }
             } else {
                 responseData.isValid = false;
                 responseData.errorMessage.username = "This user does not exist!";
             }
         }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    updateProfilePic:  async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        const updatePic = await profileManager.updateProfilePic(req.body.name, userData['userId'])
            if (updatePic) {
                responseData.successMessage = "Your Profile Image Is Updated Successfully!";
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error Updating your Profile Picture, Please try again!';
            }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    addNewPic:  async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        let name = req.body.name;
        let user_id =  userData['userId'];
        const addPic = await profileManager.addNewPic({name, user_id});
            if (addPic) {
                responseData.successMessage = "Your Image Is Added Successfully!";
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error adding your picture, Please try again!';
            }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    deletePic:  async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        let name = req.body.name;
        let user_id =  userData['userId'];
        const deletePic = await profileManager.deletePic(name, user_id);
            if (deletePic) {
                responseData.successMessage = "Your Image Is Deleted Successfully!";
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error deleting your picture, Please try again!';
            }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getCurrentUserAllInfos: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        const currentUser = await profileManager.getUserProfile(userData['userId']);
            if (currentUser) {
                currentUser[0].age = util.calculateAge(currentUser[0].born_date);
                responseData.user = currentUser[0];
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error, Please try again!';
            }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getCurrentUserProfilePic: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        const currentUser = await profileManager.getProfilePic(userData['userId']);
            if (currentUser) {
                //console.log(chalk.red(JSON.stringify(currentUser)));
                responseData.user = currentUser[0];
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error, Please try again!';
            }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getCurrentUserPicturesCount: async (req, res) => {
        let responseData = {
            isValid : true,
            errorMessage: {}
        };
        let userData = req.userData;
        const images = await profileManager.getCountPics(userData['userId']);
        if (images[0].count == 4) {
            responseData.isValid = false;
            responseData.errorMessage.error = "You are allowed to upload 4 pictures maximum!!";
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    updateTags:  async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        // console.log(chalk.yellow(JSON.stringify(req.body)));
        let userTags = req.body;
        // remove duplicate from userTags array
        userTags = [...new Set(userTags)];
        let err = validation.isTags(userTags);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.error = err;
        }
        if (responseData.isValid === true) {
            let user_id =  userData['userId'];
            let insertedTags = [];
            userTags.forEach(tag => {
                insertedTags.push([tag, user_id]);
            });
            // console.log(chalk.yellow(JSON.stringify(insertedTags)));
            const deleteTags = await profileManager.deleteTags(user_id);
                if (deleteTags) {
                    if (insertedTags.length != 0) {
                        const addTags = await profileManager.addTags(insertedTags);
                        if (addTags) {
                            responseData.successMessage = "Your Tags Are Updated Successfully!";
                        } else {
                            responseData.isValid = false;
                            responseData.errorMessage.error= 'Error updating your tags, Please try again!';
                        }
                    } 
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error updating your tags, Please try again!';
                }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getTagsList:  async (req, res) => { 
        let responseData = {
            isValid : true,
            tags: null,
            errorMessage: {}
        };
        const tags = await profileManager.getTagsList();
        if (tags) {
            responseData.tags = tags;
        } else {
            responseData.isValid = false;
            responseData.errorMessage.error= 'Error, Please try again!';
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    updateLocation:  async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let userData = req.userData;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;
        // console.log('lat :' + latitude);
        // console.log('lgt :' + longitude);
        let id =  userData['userId'];
        // validate latitude & longitude
        if (!validation.isLatitude(Number(latitude)) || !validation.isLongitude(Number(longitude))) {
            responseData.isValid = false;
            responseData.errorMessage.error = 'Unvalid Coordinates!!';
        }
        if (responseData.isValid === true) {
             const updateLocation = await profileManager.updateLocation(latitude, longitude, id);
            if (updateLocation) {
                responseData.successMessage = "Your Location Is updated Successfully!";
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error updating your location, Please try again!';
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },

}

module.exports = Profile;