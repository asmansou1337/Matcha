const notifManager = require('../models/notifModel');
let chalk = require('chalk');

const Notif = {
    getUserAllNotification: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {},
            notification: undefined
        };
        const userId = req.userData['userId'];
        const notif = await notifManager.getUserNotifications(userId);
        if (notif.length > 0) {
            responseData.notification = notif
            // console.log(chalk.yellow(JSON.stringify(notif)))
            // set notification to read = 1
            await Notif.updateNotification(userId)
        } else {
            responseData.errorMessage.error= "Error, Please Try Again!";
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    getUnreadNotifCount: async (req, res) => {
        let responseData = {
            isValid : true,
            successMessage: null,
            errorMessage: {},
            unread: undefined
        };
        const userId = req.query.id;
        const notif = await notifManager.getUnreadNotif(userId);
        if (notif[0]) {
            console.log(chalk.green(JSON.stringify(notif)))
            responseData.unread = notif[0].unread
        } else {
            responseData.isValid = false;
            responseData.errorMessage.error = 'Error, Please try again!';
        }
        if (responseData.isValid === true)
            res.status(200).send(responseData);
        else
            res.status(400).send(responseData);
    },
    addNotification: async (reciever, sender, message, link) => {
        return await notifManager.addNotif(reciever, sender, message, link);
    },
    updateNotification: async (id) => {
        return await notifManager.updateNotifications(id);
    },

}

module.exports = Notif