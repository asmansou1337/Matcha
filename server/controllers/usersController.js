let validation = require('../models/validation');
let userManager = require('../models/userModel');
let verifManager = require('../models/verificationModel');
let chalk = require('chalk');
const bcrypt = require('bcrypt');
const profileManager = require('../models/profileModel');
const util = require('../models/functions');
const notifController = require('./notifController');

const User = {
    getUserAllInfos: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const userId = req.query.id
        const connectedUserData = req.userData;
        const selectedUser = await profileManager.getUserProfile(userId);
            if (selectedUser[0]) {
                selectedUser[0].age = util.calculateAge(selectedUser[0].born_date);
                // calculate fame rating
                // rating = ((sum(likes) + sum(visits)) - ((sum(blocks) + sum(reports))) / total of users)
                selectedUser[0].fame = await util.calculateFameRating(userId);
                // format user last connection time
                let lastLogin = null;
                if(selectedUser[0].last_connection !== null) {
                    lastLogin = util.calculateLastLogin(selectedUser[0].last_connection)
                }
                selectedUser[0].lastLogin = lastLogin
                // console.log(chalk.red(JSON.stringify(selectedUser[0])))
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
        const userID = req.query.id || req.userData['userId']
        // verify user exists
        let user = await verifManager.verifyUserExists(userID);
        if (user[0].count === 0) {
            responseData.isValid = false;
            responseData.errorMessage.error= "This user does not exist!";
        } else {
            // verify the user profile is completed
            const selectedUser = await profileManager.getUserProfile(userID);
            if (selectedUser) {
                //console.log(chalk.yellow(JSON.stringify(selectedUser[0])))
                if (!validation.isProfileCompleted(selectedUser[0])) {
                    responseData.isComplete = 0;
                    responseData.errorMessage.error= "This user didn't complete his profile yet!";
                } else {
                    responseData.isComplete = 1;
                    responseData.successMessage = 'profile completed';
                }
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
            reportMessage: null,
            blockMessage: null,
            isLiked: 0,
            isBlocked: 0,
            isReported: 0,
            errorMessage: {}
        };
        let iLiked, iGotLiked;
        const otherUserId = req.query.id
        const connectedUserDataID = req.userData['userId'];
        let checkLike = await userManager.checkLikeRelation(connectedUserDataID, otherUserId);
        // console.log(chalk.yellow(JSON.stringify(checkLike)))
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
        // check block
        let checkBlock = await userManager.checkBlocked(connectedUserDataID, otherUserId);
        if (checkBlock.length > 0) {
            responseData.blockMessage = 'You blocked this user';
            responseData.isBlocked = 1
        }
        // check report
        let checkReported = await userManager.checkReported(connectedUserDataID, otherUserId);
        if (checkReported.length > 0) {
                responseData.reportMessage = 'You reported this user';
                responseData.isReported = 1
        } 
        // console.log(chalk.blue(JSON.stringify(responseData)))
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
        let message;
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
                // Add notification
                if (responseData.isValid === true) {
                    message = `${req.userData['username']} unlikes you.`
                    await notifController.addNotification(liked_user_id, liker_user_id, message, `/user?id=${liker_user_id}`)
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
                // Add notification
                if (responseData.isValid === true) {
                    let checkLiked = await userManager.checkLiked(liked_user_id, liker_user_id);
                    if (checkLiked.length > 0) 
                        message = `${req.userData['username']} likes you back.`
                    else
                        message = `${req.userData['username']} likes you.`
                    await notifController.addNotification(liked_user_id, liker_user_id, message, `/user?id=${liker_user_id}`)
                }
            }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    blockUser: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const blocker_user_id = req.userData['userId'];
        const blocked_user_id = req.query.id;
        // check block
        let checkBlock = await userManager.checkBlocked(blocker_user_id, blocked_user_id);
        if (checkBlock.length > 0) {
                // unblock the user
                let delBlock = await userManager.deleteBlock(blocker_user_id, blocked_user_id);
                if (delBlock) {
                    responseData.successMessage = 'Block deleted successfully';
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error, Please try again!';
                }
        } else {
                // block the user
                let addBlock = await userManager.addBlock({blocker_user_id, blocked_user_id});
                if (addBlock) {
                    responseData.successMessage = 'Block added successfully';
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error, Please try again!';
                }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    reportUser: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const reporter_user_id = req.userData['userId'];
        const reported_user_id = req.query.id;
        // check if the user is already reported 
        let checkReported = await userManager.checkReported(reporter_user_id, reported_user_id);
        if (checkReported.length > 0) {
                responseData.message = 'You already reported this user';
        } else {
                // report the user
                let addReport = await userManager.addReport({reporter_user_id, reported_user_id});
                if (addReport) {
                    responseData.successMessage = 'Report added successfully';
                } else {
                    responseData.isValid = false;
                    responseData.errorMessage.error= 'Error, Please try again!';
                }
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    visitUser: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        let message;
        const visitor_user_id = req.userData['userId'];
        const visited_user_id = req.query.id;
        // check if it's the first time this user visit this profile
        let checkVisited = await userManager.checkVisited(visitor_user_id, visited_user_id);
        // console.log(chalk.green(JSON.stringify(checkVisited)))
        if (checkVisited.length > 0) {
            // IN case is not the first visit
            let updateVisit = await userManager.updateVisit(visitor_user_id, visited_user_id);
            if (updateVisit) {
                responseData.successMessage = 'visit updated successfully';
                message = `${req.userData['username']} visited you profile ${checkVisited[0]['nbr_visits']} times.`
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error, Please try again!';
            }
        } else {
            // the first time visited
            let nbr_visits = 1
            let firstVisit = await userManager.addVisit({visitor_user_id, visited_user_id, nbr_visits});
            if (firstVisit) {
                responseData.successMessage = 'visit added successfully';
                message = `${req.userData['username']} visited you profile 1 time.`
            } else {
                responseData.isValid = false;
                responseData.errorMessage.error= 'Error, Please try again!';
            }
        }

        // Add notification
        if (responseData.isValid === true) {
            await notifController.addNotification(visited_user_id, visitor_user_id, message, `/user?id=${visitor_user_id}`)
        }
        
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    history: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {}
        };
        const connectedUserData = req.userData;
        // get list of users who likes you
        let likersUsers = await userManager.likersUsers(connectedUserData['userId']);
        if (likersUsers.length > 0) {
            // console.log(chalk.green(JSON.stringify(likersUsers)))
            responseData.likersUsers = likersUsers
        }
        let likedUsers = await userManager.likedUsers(connectedUserData['userId']);
        if (likedUsers.length > 0) {
            // console.log(chalk.red(JSON.stringify(likedUsers)))
            responseData.likedUsers = likedUsers
        }
        let visitorsUsers = await userManager.visitorsUsers(connectedUserData['userId']);
        if (visitorsUsers.length > 0) {
            responseData.visitorsUsers = visitorsUsers
        }
        // get list of users who matches you
        let mutualUsers = await userManager.mutualUsers(connectedUserData['userId']);
        if (mutualUsers.length > 0) {
            // console.log(chalk.green(JSON.stringify(likersUsers)))
            responseData.mutualUsers = mutualUsers
        }
        let blockedUsers = await userManager.blockedUsers(connectedUserData['userId']);
        if (blockedUsers.length > 0) {
            // console.log(chalk.red(JSON.stringify(likedUsers)))
            responseData.blockedUsers = blockedUsers
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    }
}

module.exports = User