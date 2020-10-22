let validation = require('../utilities/validation');
let chalk = require('chalk');
const userManager = require('../models/browseModel');
const profileManager = require('../models/profileModel');
const util = require('../utilities/functions');

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
    const keyword = filter['keyword'].toString().toLowerCase();
    const connectedUserData = req.userData;
    let listTags = []
    const connectedUser = await profileManager.getUserProfile(connectedUserData['userId'])
    const users = await userManager.getUsers(connectedUserData['userId'])
        if (users) {
            // before filtering the result we check if the filter values are valid
            let err = validation.isFilterValid(filter)
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
                        // delete duplicate if exists
                        listTags = [...new Set(JSON.parse(filter['TagsTab']))];
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
                        // filter by keyword
                        if(!users[i].username.toLowerCase().includes(keyword) && !users[i].firstName.toLowerCase().includes(keyword)
                        && !users[i].lastName.toLowerCase().includes(keyword))
                        {
                            users.splice(i, 1);
                            i--;
                            continue;   
                        }
                    } else {
                        responseData.errorMessage.error = err;
                    }
                };
            // console.log(chalk.red(JSON.stringify(users)))
            // sort users list
            users.sort(util.compareValues(filter.sortOption, filter.sortType));
            responseData.searchList = users
            }
    filter.tags = listTags
    responseData.filter = filter
    if (responseData.isValid === true)
        res.status(200).send(responseData);
    else
        res.status(400).send(responseData);
},
getBrowseList: async (req, res) => {
    let responseData = {
        isValid : true,
        successMessage: null,
        errorMessage: {},
        browseList: {},
        userTags: []
    };
    const connectedUserData = req.userData;
    let users;
    const connectedUser = await profileManager.getUserProfile(connectedUserData['userId'])
    // console.log(chalk.green(JSON.stringify(connectedUser)))
    if ((connectedUser[0].gender === 'female' && connectedUser[0].preference === 'heterosexual') || 
    (connectedUser[0].gender === 'male' && connectedUser[0].preference === 'homosexual')) {
        users = await userManager.getUsersByPref(connectedUserData['userId'], 'male')
    } else if ((connectedUser[0].gender === 'male' && connectedUser[0].preference === 'heterosexual') || 
    (connectedUser[0].gender === 'female' && connectedUser[0].preference === 'homosexual')) {
        users = await userManager.getUsersByPref(connectedUserData['userId'], 'female')
    } else {
        users = await userManager.getUsers(connectedUserData['userId'])
    }
    if (users) {
        for (let i = 0; i < users.length; i++) {
            // calculate age
            users[i].age = util.calculateAge(users[i].born_date);
            // calculate fame rating
            users[i].fame = await util.calculateFameRating(users[i].id);
            // calculate distance between each user and current connected user
            users[i].distance = util.calculateDistance(connectedUser[0], users[i]);
            // calculate common tags with connected user
            if (connectedUser[0].tags.length > 0) {
                let listTags = connectedUser[0].tags.split(',')
                if (users[i].tags !== null) {
                    let tags = users[i].tags.split(',')
                    let commonTags = util.filterByTags(tags, listTags)
                    if(commonTags === 0) {
                        users.splice(i, 1);
                        i--;
                        continue;
                    }
                    users[i].commonTags = commonTags
                } else {
                    users.splice(i, 1);
                    i--;
                    continue;
                }
            }
            // format user last connection time
            let lastLogin = null;
            if(users[i].last_connection !== null) {
                lastLogin = util.calculateLastLogin(users[i].last_connection)
            }
            users[i].lastLogin = lastLogin
        };
        // Sort in priority by distance, common tags & fame rating
        users.sort((a, b) => {
            const compare_distance = Number(a.distance) - Number(b.distance);
            const compare_commonTags = Number(a.commonTags) - Number(b.commonTags);
            const compare_fame = Number(a.fame) - Number(b.fame); 
            return compare_distance || -compare_commonTags || -compare_fame;
          });
        // console.log(chalk.yellow(JSON.stringify(users)))
        responseData.browseList = users
    }
    responseData.userTags = connectedUser[0].tags.split(',')
    if (responseData.isValid === true)
        res.status(200).send(responseData);
    else
        res.status(400).send(responseData);
},
getFilterBrowseList: async (req, res) => {
    let responseData = {
        isValid : true,
        successMessage: null,
        errorMessage: {},
        browseList: {},
        userTags: []
    };
    const filter = req.body;
    const ageMin = filter['age-min'] || 18;
    const ageMax = filter['age-max'] || 120;
    const ratingMin = filter['rating-min'] || 0;
    const ratingMax = filter['rating-max'] || 5;
    const locationMin = filter['location-min'];
    const locationMax = filter['location-max'];
    let listTags
    try {
        listTags = JSON.parse(filter['TagsTab']);
        // delete duplicate if exists
        listTags = [...new Set(listTags)];
    } catch (error) {
        responseData.isValid = false;
        responseData.errorMessage.error = "Unvalid Tags!!"
    }
    const connectedUserData = req.userData;
    let users;
    const connectedUser = await profileManager.getUserProfile(connectedUserData['userId'])
    if (responseData.isValid === true) {
        // console.log(chalk.green(JSON.stringify(connectedUser)))
        if ((connectedUser[0].gender === 'female' && connectedUser[0].preference === 'heterosexual') || 
        (connectedUser[0].gender === 'male' && connectedUser[0].preference === 'homosexual')) {
            users = await userManager.getUsersByPref(connectedUserData['userId'], 'male')
        } else if ((connectedUser[0].gender === 'male' && connectedUser[0].preference === 'heterosexual') || 
        (connectedUser[0].gender === 'female' && connectedUser[0].preference === 'homosexual')) {
            users = await userManager.getUsersByPref(connectedUserData['userId'], 'female')
        } else {
            users = await userManager.getUsers(connectedUserData['userId'])
        }
        if (users) {
            // check if the filter values are valid
            let userTags = connectedUser[0].tags.split(',')
            let filterTags = util.selectedTags(userTags, listTags)
            // console.log(chalk.green(JSON.stringify(filterTags)))
            err = validation.isFilterValid(filter)
            for (let i = 0; i < users.length; i++) {
                // calculate age
                users[i].age = util.calculateAge(users[i].born_date);
                // calculate fame rating
                users[i].fame = await util.calculateFameRating(users[i].id);
                // calculate distance between each user and current connected user
                users[i].distance = util.calculateDistance(connectedUser[0], users[i]);
                // calculate common tags with connected user
                if (connectedUser[0].tags.length > 0) {
                    if (users[i].tags !== null) {
                        let tags = users[i].tags.split(',')
                        let commonTags = util.filterByTags(tags, filterTags)
                        if(commonTags === 0) {
                            users.splice(i, 1);
                            i--;
                            continue;
                        }
                        users[i].commonTags = commonTags
                    } else {
                        users.splice(i, 1);
                        i--;
                        continue;
                    }
                }
    
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
                } else {
                    responseData.errorMessage.error = err;
                }
    
                // format user last connection time
                let lastLogin = null;
                if(users[i].last_connection !== null) {
                    lastLogin = util.calculateLastLogin(users[i].last_connection)
                }
                users[i].lastLogin = lastLogin
            };
            if (typeof filter.sortOption !== 'undefined' && filter.sortOption !== 'default') {
                users.sort(util.compareValues(filter.sortOption, filter.sortType));
            } else {
                // Sort in priority by distance, common tags & fame rating
                users.sort((a, b) => {
                    const compare_distance = Number(a.distance) - Number(b.distance);
                    const compare_commonTags = Number(a.commonTags) - Number(b.commonTags);
                    const compare_fame = Number(a.fame) - Number(b.fame); 
                    return compare_distance || -compare_commonTags || -compare_fame;
                });
            }
            
            // console.log(chalk.yellow(JSON.stringify(users)))
            responseData.browseList = users
        }
    }
    responseData.filter = filter
    responseData.userTags = connectedUser[0].tags.split(',')
    if (responseData.isValid === true)
        res.status(200).send(responseData);
    else
        res.status(400).send(responseData);
},
}

module.exports = Browse