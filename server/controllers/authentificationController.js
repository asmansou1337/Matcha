var validation = require('../models/validation');
var authManager = require('../models/authentificationModel');
var chalk = require('chalk');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('../models/mailModel');
const profileManager = require('../models/profileModel');
const jwt = require("jsonwebtoken");

const Auth = {
    signup: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: []
        };
        let { firstName, lastName, username, email, password, confirmPassword } = req.body;
        // Validate First Name
        if (validation.isEmpty(firstName)){
            responseData.isValid = false;
            responseData.errorMessage.push({firstName: "Your first name should not be empty!"});
        } else if(!validation.isName(firstName.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({firstName: "Your first name should contain caracteres only!"});
        }
        // Validate Last Name
        if (validation.isEmpty(lastName)) {
            responseData.isValid = false;
            responseData.errorMessage.push({lastName: "Your last name should not be empty!"});
        } else if(!validation.isName(lastName.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({lastName: "Your last name should contain caracteres only!"});
        }
        // Validate Username
        if (validation.isEmpty(username)) {
            responseData.isValid = false;
            responseData.errorMessage.push({username: "Your username should not be empty!"});
        } else if(!validation.isUsername(username.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({username: "Your username should contain alphanumerique caracteres only!"});
        }
        // Validate Email
        if (validation.isEmpty(email)) {
            responseData.isValid = false;
            responseData.errorMessage.push({email: "Your email should not be empty!"});
        }else if(!validation.isEmail(email.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({email: "Your email is not valid!"});
        }
        // Validate Password Confirmation
        if (validation.isEmpty(confirmPassword)) {
            responseData.isValid = false;
            responseData.errorMessage.push({confirmPassword: "Your password should not be empty!"});
        }else if(!validation.isConfirmPassword(password.trim(), confirmPassword.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({confirmPassword: "Both password should be the same!"});
        }
        // Validate Password
        if (validation.isEmpty(password)) {
            responseData.isValid = false;
            responseData.errorMessage.push({password: "Your password should not be empty!"});
        }else if(!validation.isPassword(password.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({password: "Password should be at least 8 characters in length and should include at least one uppercase letter,one lowercase letter, one number, and one special character.!"});
        }

        // Validation: username & email should be unique
        if (responseData.isValid === true) {
            const verifUsername = await authManager.verifyUsernameExists(username);
            if (verifUsername[0].count !== 0) {
                responseData.isValid = false;
                responseData.errorMessage.push({username: "This username already exist, Please choose another one!"});
            }
            const verifEmail = await authManager.verifyEmailExists(email);
            if (verifEmail[0].count !== 0) {
                responseData.isValid = false;
                responseData.errorMessage.push({email: "This email already exist, Please choose another one!"});
            } 
        }

        if (responseData.isValid === true) {
            // Creation of hashed password
            password = await bcrypt.hash(password, 10);
            // Creation of token
            let token = crypto.randomBytes(40).toString('hex');
            const register = await authManager.register({firstName, lastName, username, email, password, token});
            if (register) {
                // Send Activation MAIL
                const subject = 'Matcha: Account Activation';
                const content = `Hi ${username}, <br>Folow the link below to activate your account: 
                <a href='http://${process.env.HOST}:${process.env.PORT}/activateAccount/${token}'>Link</a><br>`;
                const m = await mail.sendMail(email, subject, content);
                if (m) {
                    responseData.successMessage = "Your Account has been created successfully, Please check your Email for the activation link";
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.push({error: 'Error Creating your account, Please try again!'});
                }
            } else {
                responseData.isValid = false;
                responseData.errorMessage.push({error: 'Error Creating your account, Please try again!'});
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
            errorMessage: []
        };
        // Validate token (should be alphanumerique string)
        const token = req.params.token;
        if (!validation.isToken(token)) {
            responseData.isValid = false;
            responseData.errorMessage.push({error: 'Unvalid link, Please Try Again!'});
        } else {
            const verifTokenExist = await authManager.verifyTokenExists(token);
            if (verifTokenExist[0].count !== 1) {
                responseData.isValid = false;
                responseData.errorMessage.push({error: "Unvalid link, Please Try Again!"});
            } else {
                const verifActivation = await authManager.verifyAccountActivated(token);
                if (verifActivation[0].count === 1) {
                    responseData.isValid = false;
                    responseData.errorMessage.push({error: "This account is already activated !"});
                } else {
                    const activation = await authManager.activateAccount(token);
                    if (activation) 
                        responseData.successMessage = "Your Account has been activated successfully."
                    else
                        responseData.errorMessage.push({error: "Something went wrong while activating your account, Please Try Again!"});
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
            errorMessage: []
        };
        let {username, password} = req.body;
        // Validate Username
        if (validation.isEmpty(username)) {
            responseData.isValid = false;
            responseData.errorMessage.push({username: "Your username should not be empty!"});
        } else if(!validation.isUsername(username.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({username: "Your username should contain alphanumerique caracteres only!"});
        }
         // Validate Password
         if (validation.isEmpty(password)) {
            responseData.isValid = false;
            responseData.errorMessage.push({password: "Your password should not be empty!"});
        } else if(!validation.isPassword(password.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({password: "Password should be at least 8 characters in length and should include at least one uppercase letter,one lowercase letter, one number, and one special character.!"});
        }

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
                        // Create JWT token
                        const token = jwt.sign(
                            {
                              username: user[0].username,
                              userId: user[0].id
                            },
                            process.env.JWT_KEY,
                            { expiresIn: "12h" }
                          );
                        responseData.successMessage = "login success";
                        responseData.authToken = token;
                    }
                    else {
                        responseData.isValid = false;
                        responseData.errorMessage.push({error: "Account Activation Required!"});
                    }
                } else {
                     // Passwords don't match
                     console.log("Wrong Password!");
                     responseData.isValid = false;
                     responseData.errorMessage.push({error: "Wrong Password!"});
                }
            } else {
                responseData.isValid = false;
                responseData.errorMessage.push({error: "This username does not exist!"});
            }
        }
        if (responseData.isValid === true)
            res.status(201).send(responseData);
        else
            res.status(400).send(responseData);
    },
    sendResetEmail: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: []
        };
        let {email} = req.body;
        // Validate Email
        if (validation.isEmpty(email)) {
            responseData.isValid = false;
            responseData.errorMessage.push({email: "Your email should not be empty!"});
        } else if(!validation.isEmail(email.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({email: "Your email is not valid!"});
        }
        // Verify if email exists
        if (responseData.isValid === true) {
            const verifEmail = await authManager.verifyEmailExists(email);
            if (verifEmail[0].count === 0) {
                responseData.isValid = false;
                responseData.errorMessage.push({email: "This email does not exist, Please choose another one!"});
            } else {
                const user = await authManager.getUserInfos('email', email);
                // Send Activation MAIL
                const subject = 'Matcha: Password Reinitialisation Link';
                const content = `Hi ${user[0].username}, <br>Folow the link below to reinitialize your password: 
                <a href='http://${process.env.HOST}:${process.env.PORT}/reinitializePassword/${user[0].token}'>Link</a><br>`;
                const m = await mail.sendMail(email, subject, content);
                if (m) {
                    responseData.successMessage = "A link to reinitialize your password is sent to you, Please check your Email.";
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.push({error: 'Error Sending Email, Please try again!'});
                }
            }
        }
        if (responseData.isValid === true)
            res.status(201).send(responseData);
        else
            res.status(400).send(responseData);
    },
    reinitializePassword: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: []
        };
        let {password, confirmPassword} = req.body;
        let token = req.params.token;
        // Validate Password Confirmation
        if (validation.isEmpty(confirmPassword)) {
            responseData.isValid = false;
            responseData.errorMessage.push({confirmPassword: "Your password should not be empty!"});
        } else if(!validation.isConfirmPassword(password.trim(), confirmPassword.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({confirmPassword: "Both password should be the same!"});
        }
        // Validate Password
        if (validation.isEmpty(password)) {
            responseData.isValid = false;
            responseData.errorMessage.push({password: "Your password should not be empty!"});
        }else if(!validation.isPassword(password.trim())) {
            responseData.isValid = false;
            responseData.errorMessage.push({password: "Password should be at least 8 characters in length and should include at least one uppercase letter,one lowercase letter, one number, and one special character.!"});
        }
        if (responseData.isValid === true) {
            if (!validation.isToken(token)) {
                responseData.isValid = false;
                responseData.errorMessage.push({error: 'Unvalid link, Please Try Again!'});
            } else {
                const verifTokenExist = await authManager.verifyTokenExists(token);
                if (verifTokenExist[0].count !== 1) {
                    responseData.isValid = false;
                    responseData.errorMessage.push({error: "Unvalid link, Please Try Again!"});
                } else {
                    // Creation of hashed password
                    password = await bcrypt.hash(password, 10);
                    const update = await profileManager.updatePassword(password, token);
                    if (update) {
                        responseData.successMessage = "Your password has changed successfuly.";
                    } else {
                        responseData.isValid = false;
                        responseData.errorMessage.push({error: 'Error Updating your password, Please try again!'});
                    }
                }
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    }
}

module.exports = Auth;