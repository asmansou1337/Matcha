var validation = require('../models/validation');
var authManager = require('../models/authentificationModel');
let tokenManager = require('../models/autorizationModel');
var verifManager = require('../models/verificationModel');
var chalk = require('chalk');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('../models/mailModel');
const profileManager = require('../models/profileModel');

const Auth = {
    signup: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        // get the form infos from the request body
        let { firstName, lastName, username, email, password, confirmPassword, latitude, longitude } = req.body;
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
            responseData.errorMessage.email= err;
        }
        // Validate Password Confirmation
        err = validation.isConfirmPassword(password, confirmPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.confirmPassword= err;
        }
        // Validate Password
        err = validation.validate(password, "password", validation.isPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.password= err;
        }

        // Validation: username & email should be unique
        if (responseData.isValid === true) {
            const verifUsername = await verifManager.verifyUsernameExists(username);
            if (verifUsername[0].count !== 0) {
                responseData.isValid = false;
                responseData.errorMessage.username= "This username already exist, Please choose another one!";
            }
            const verifEmail = await verifManager.verifyEmailExists(email);
            if (verifEmail[0].count !== 0) {
                responseData.isValid = false;
                responseData.errorMessage.email= "This email already exist, Please choose another one!";
            } 
        }

        if (responseData.isValid === true) {
            // Creation of hashed password
            password = await bcrypt.hash(password, 10);
            // Creation of token
            let token = crypto.randomBytes(40).toString('hex');
            let preference = 'bisexual';
            const register = await authManager.register({firstName, lastName, username, email, password, token, preference, latitude, longitude});
            if (register) {
                // Send Activation MAIL
                const subject = 'Matcha: Account Activation';
                const content = `Hi ${username}, <br>Folow the link below to activate your account: 
                <a href='http://${process.env.HOST}:${process.env.PORT_FRONT}/activateAccount?token=${token}'>Link</a><br>`;
                
                const m = await mail.sendMail(email, subject, content).catch(e => console.log(chalk.yellow(e)));
                if (m) {
                    responseData.successMessage = "Your Account has been created successfully, Please check your Email for the activation link";
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error Creating your account, Please try again!';
                }

            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error Creating your account, Please try again!';
            }
        }
        if (responseData.isValid === true)
            res.status(201).send(responseData);
        else
            res.status(400).send(responseData);
    },
    activateAccount: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        // Validate token (should be alphanumerique string)
        const token = req.query.token;
        if (!validation.isToken(token)) {
            responseData.isValid = false;
            responseData.errorMessage.error = 'Unvalid link, Please Try Again!';
        } else {
            const verifTokenExist = await authManager.verifyTokenExists(token);
            if (verifTokenExist[0].count !== 1) {
                responseData.isValid = false;
                responseData.errorMessage.error = "Unvalid link, Please Try Again!";
            } else {
                const verifActivation = await authManager.verifyAccountActivated(token);
                if (verifActivation[0].count === 1) {
                    responseData.isValid = false;
                    responseData.errorMessage.error =  "This account is already activated !";
                } else {
                    const activation = await authManager.activateAccount(token);
                    if (activation) 
                        responseData.successMessage = "Your Account has been activated successfully."
                    else
                        responseData.errorMessage.error = "Something went wrong while activating your account, Please Try Again!";
                }
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    login: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let {username, password} = req.body;
        // Validate Username
        let err = validation.validate(username, "username", validation.isUsername);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.username = err;
        }
         // Validate Password
        err = validation.validate(password, "password", validation.isPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.password =  err;
        }
        // Verify if the login infos are correct & create autorisation token
        if (responseData.isValid === true) {
            const user = await authManager.verifLoginInfo(username);
            if (user[0]) {
                // Verify password is correct
                const match = await bcrypt.compare(password, user[0].password);
                if (match) {
                    // Passwords match
                    if(user[0].is_active === 1)
                    {
                        console.log("login success");
                        // update user statut to online
                        await authManager.updateStatut(user[0].id);
                        // Create JWT token
                        responseData.successMessage = "login success";
                        responseData.authToken = tokenManager.createNewAuthToken(user[0].id, user[0].username , user[0].email);
                    }
                    else {
                        responseData.isValid = false;
                        responseData.errorMessage.error = "Account Activation Required!";
                    }
                } else {
                    // Passwords don't match
                    responseData.isValid = false;
                    responseData.errorMessage.password = "Wrong Password!";
                }
            } else {
                responseData.isValid = false;
                responseData.errorMessage.username = "This username does not exist!";
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    sendResetEmail: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let {email} = req.body;
        // Validate Email
        let err = validation.validate(email, "email", validation.isEmail);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.email = err;
        }
        // Verify if email exists
        if (responseData.isValid === true) {
            const verifEmail = await verifManager.verifyEmailExists(email);
            if (verifEmail[0].count === 0) {
                responseData.isValid = false;
                responseData.errorMessage.email = "This email does not exist, Please choose another one!";
            } else {
                const user = await authManager.getUserInfos('email', email);
                // Send Activation MAIL
                const subject = 'Matcha: Password Reinitialisation Link';
                const content = `Hi ${user[0].username}, <br>Folow the link below to reinitialize your password: 
                <a href='http://${process.env.HOST}:${process.env.PORT_FRONT}/reinitializePassword?token=${user[0].token}'>Link</a><br>`;
                const m = await mail.sendMail(email, subject, content);
                if (m) {
                    responseData.successMessage = "A link to reinitialize your password is sent to you, Please check your Email.";
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error = 'Error Sending Email, Please try again!';
                }
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    reinitializePassword: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let {password, confirmPassword} = req.body;
        let token = req.query.token;
        // Validate Password Confirmation
        let err = validation.isConfirmPassword(password, confirmPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.confirmPassword = err;
        }
        // Validate Password
        err = validation.validate(password, "password", validation.isPassword);
        if (err !== "success") {
            responseData.isValid = false;
            responseData.errorMessage.password = err;
        }
        // Check if token exist & is valid before updating the password & reseting the token
        if (responseData.isValid === true) {
            if (!validation.isToken(token)) {
                responseData.isValid = false;
                responseData.errorMessage.error = 'Unvalid link, Please Try Again!';
            } else {
                const verifTokenExist = await authManager.verifyTokenExists(token);
                if (verifTokenExist[0].count !== 1) {
                    responseData.isValid = false;
                    responseData.errorMessage.error = "Unvalid link, Please Try Again!";
                } else {
                    // Creation of hashed password
                    password = await bcrypt.hash(password, 10);
                    const update = await profileManager.updatePassword(password, token, 'token');
                    if (update) {
                        responseData.successMessage = "Your password has changed successfuly.";
                        // Reset token
                        let newToken = crypto.randomBytes(40).toString('hex');
                        await authManager.resetToken(newToken, token);
                    } else {
                        responseData.isValid = false;
                        responseData.errorMessage.error = 'Error Updating your password, Please try again!';
                    }
                }
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    logout: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        // get connected user data from token
        let userData = req.userData;
        // update user statut
        let logout = await authManager.logout(userData['userId'])
        if (logout) {
            responseData.successMessage = "Logout successfuly.";
        } else {
            responseData.isValid = false;
            responseData.errorMessage.error = 'Error Login out, Please try again!';
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    }
}

module.exports = Auth;