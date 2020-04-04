let validation = require('../models/validation');
let authManager = require('../models/authentificationModel');
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
}

module.exports = User