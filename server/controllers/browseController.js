let validation = require('../models/validation');
let chalk = require('chalk');
const userManager = require('../models/browseModel');
const profileManager = require('../models/profileModel');
const util = require('../models/functions');

const Browse = {
getSearchList: async (req, res) => {
    let responseData = {
        isValid : true,
        successMessage: null,
        errorMessage: {},
        searchList: {}
    };
    const connectedUserData = req.userData;
    const connectedUser = await profileManager.getUserProfile(connectedUserData['userId'])
    const users = await userManager.getUsers(connectedUserData['userId'])
    if (users) {
        for (const user of users) {
            // calculate age
            user.age = util.calculateAge(user.born_date);
            // calculate fame rating
            user.fame = await util.calculateFameRating(user.id);
            // calculate distance between each user and current connected user
            user.distance = util.calculateDistance(connectedUser[0], user);
            // format user last connection time
            let lastLogin = null;
            if(user.last_connection !== null) {
                lastLogin = util.calculateLastLogin(user.last_connection)
            }
            user.lastLogin = lastLogin
        };
        responseData.searchList = users
    }
    if (responseData.isValid === true)
        res.status(200).send(responseData);
    else
        res.status(400).send(responseData);
},
getFilterSearchList: async (req, res) => {
    let responseData = {
        isValid : true,
        successMessage: null,
        errorMessage: {},
        searchList: {}
    };
    const filter = req.body;
    const ageMin = filter['age-min'] || 18;
    const ageMax = filter['age-max'] || 120;
    const ratingMin = filter['rating-min'] || 0;
    const ratingMax = filter['rating-max'] || 5;
    const locationMin = filter['location-min'];
    const locationMax = filter['location-max'];
      console.log(chalk.yellow(JSON.stringify(filter)))
    // console.log(chalk.red(validation.isFilterValid(filter)))
    let listTags = JSON.parse(filter['TagsTab']);
    // delete duplicate if exists
    listTags = [...new Set(listTags)];
    // console.log(chalk.yellow('tags ' + listTags + ' ' + JSON.stringify(listTags)))
    const connectedUserData = req.userData;
    if (responseData.isValid === true) {
        const connectedUser = await profileManager.getUserProfile(connectedUserData['userId'])
        const users = await userManager.getUsers(connectedUserData['userId'])
        if (users) {
            // before filtering the result we check if the filter values are valid
            let err = validation.isFilterValid(filter, listTags)
                // filter users 
                for (let i = 0; i < users.length; i++) {
                    // calculate age
                    users[i].age = util.calculateAge(users[i].born_date);
                    // calculate fame rating
                    users[i].fame = await util.calculateFameRating(users[i].id);
                    // calculate distance between each user and current connected user
                    let distance = util.calculateDistance(connectedUser[0], users[i])
                    users[i].distance = distance;
                     // format user last connection time
                    let lastLogin = null;
                    if(users[i].last_connection !== null) {
                         lastLogin = util.calculateLastLogin(users[i].last_connection)
                    }
                    users[i].lastLogin = lastLogin
                    if (err === 'success') {
                    // filter by age
                    if (!(users[i].age >= ageMin && users[i].age <= ageMax)) {
                        // console.log(chalk.red('age ' + users[i].age))
                        users.splice(i, 1);
                        i--;
                        continue;
                    }
                    // filter by fame rating
                    if (!(users[i].fame >= ratingMin && users[i].fame <= ratingMax)) {
                        // console.log(chalk.red('fame ' + users[i].fame))
                        users.splice(i, 1);
                        i--;
                        continue;
                    }
                    // filter by distance
                    if (!util.isEmpty(locationMin) && !util.isEmpty(locationMax)) {
                        if (!(users[i].distance >= locationMin && users[i].distance <= locationMax)) {
                            // console.log(chalk.red('distance ' + users[i].distance))
                            users.splice(i, 1);
                            i--;
                            continue;
                        }
                    }
                    // filter by tags
                    if (listTags.length > 0) {
                        if (users[i].tags !== null) {
                            let tags = users[i].tags.split(',')
                            let commonTags = util.filterByTags(tags, listTags)
                            // console.log(chalk.green(tags))
                            // console.log(chalk.blue(commonTags))
                            if(commonTags === 0) {
                                users.splice(i, 1);
                                i--;
                                continue;
                            }
                            users[i].commonTags = commonTags
                        } else {
                            // for users who don't have any tags
                            users.splice(i, 1);
                            i--;
                            continue;
                        }
                    }
                    } else {
                        responseData.errorMessage.error = err;
                    }
                };
            filter.tags = listTags
            responseData.filter = filter
            console.log(chalk.red(JSON.stringify(users)))
            // sort users list
            users.sort(util.compareValues(filter.sortOption, filter.sortType));
            responseData.searchList = users
            }
    }
    
    if (responseData.isValid === true)
        res.status(200).send(responseData);
    else
        res.status(400).send(responseData);
}
}

module.exports = Browse