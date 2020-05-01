let validation = require('../models/validation');
let chalk = require('chalk');
const userManager = require('../models/userModel');
const chatManager = require('../models/chatModel');
const profileManager = require('../models/profileModel');
const util = require('../models/functions');

const chat = {
    getMatchingUsers: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const connectedUserData = req.userData;
        // get list of users who matches you
        let mutualUsers = await userManager.mutualUsers(connectedUserData['userId']);
        if (mutualUsers.length > 0) {
            for (let i = 0; i < mutualUsers.length; i++) {
                // check if conversation exists otherwise create one
                let checkConv = await chatManager.getConversation(mutualUsers[i].matchedId, mutualUsers[i].userId);
                // console.log(chalk.red(JSON.stringify(checkConv)))
                if (checkConv.length > 0) {
                    mutualUsers[i].convId = checkConv[0].id;
                } else {
                    let addConv = await chatManager.addConversation(connectedUserData['userId'], mutualUsers[i].matchedId)
                    // console.log(chalk.white(JSON.stringify(addConv)))
                    mutualUsers[i].convId = addConv.insertId
                }
            };
            // console.log(chalk.green(JSON.stringify(mutualUsers)))
            responseData.mutualUsers = mutualUsers
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    sendMessage: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const connectedUserData = req.userData;
        // Verify the conversation is valid && the user sending the message is the connected user
        let { userTo, userFrom, convId, msg } = req.body;
        let checkConv = await chatManager.checkConversation(userTo, userFrom, convId)
        console.log(JSON.stringify(req.body))
        if (checkConv.length === 1) {
            // verify the users are matched
            let checklike1 = await userManager.checkLiked(userTo, userFrom)
            let checklike2 = await userManager.checkLiked(userFrom, userTo)
            if (checklike1.length === 1 && checklike2.length === 1) {
                // check if any of the users blocks the other
                let checkBlock = await userManager.checkBlock(userTo, userFrom);
                console.log(chalk.green(JSON.stringify(checkBlock)))
                if (checkBlock.length > 0) {
                    if (checkBlock[0].blocked_user_id === Number(userFrom)) {
                        responseData.isValid = false;
                        responseData.errorMessage.error = 'Error, You\'re blocked by this user!!';
                    } else if (checkBlock[0].blocker_user_id === Number(userFrom)) {
                        responseData.isValid = false;
                        responseData.errorMessage.error = 'Error, You blocked this user!!';
                    }
                } else {
                    // validate the message sent
                    let err = validation.validate(msg, "chat message", validation.isMsg);
                    if (err !== "success") {
                        responseData.isValid = false;
                        responseData.errorMessage.error = err;
                    } else
                        msg = util.escapeHtml(msg.trim());
                    // add msg to database if it's valide
                    if (responseData.isValid === true) {
                        let addMsg = await chatManager.addNewMsg(convId, userFrom, msg);
                        if (addMsg) {
                            responseData.successMessage = 'Msg added successfully';
                        } else {
                            responseData.isValid = false;
                            responseData.errorMessage.error= 'Error, Please try again!';
                        }
                    }
                }
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error = 'Error, You\'re not matched!!';
            }
        } else {
            responseData.isValid = false;
            responseData.errorMessage.error = 'Error, Please try again!';
        }
        console.log(chalk.green(JSON.stringify(responseData)))
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getConvMessages: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const connectedUserData = req.userData;
        // Verify the conversation is valid
        let { to, from, convId } = req.query;
        let checkConv = await chatManager.checkConversation(to, from, convId)
        console.log(JSON.stringify(req.query))
        if (checkConv.length === 1) {
            // get the conversation messages
            let convs = await chatManager.getMessages(convId)
            if (convs) {
                for (const msg of convs) {
                    // Format time 
                    let msgTime = null;
                    if(msg.created_at !== null) {
                        msgTime = util.calculateLastLogin(msg.created_at)
                    }
                    msg.msgTime = msgTime
                    // define if the message belong to the connected user or not
                    if (msg.user_id === connectedUserData['userId'])
                        msg.belong = 'mine'
                    else
                        msg.belong = 'other'
                };
                responseData.messages = convs
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error = 'Error, Please try again!';
            }
        } else {
            responseData.isValid = false;
            responseData.errorMessage.error = 'Error, Please try again!';
        }
        console.log(chalk.green(JSON.stringify(responseData)))
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    }
}

module.exports = chat