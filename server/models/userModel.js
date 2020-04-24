const conn = require('../config/database');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const db = require('../models/databaseModel')

const user = {
    checkBlock: async (blockerID, blockedID) => {
        const sql = "SELECT * FROM blocked_users WHERE (blocked_user_id = ? AND blocker_user_id = ?) OR (blocked_user_id = ? AND blocker_user_id = ?)"
        return db.selectDB([blockerID, blockedID, blockedID, blockerID], sql)
    },
    checkBlocked: async (blockerID, blockedID) => {
        const sql = "SELECT * FROM blocked_users WHERE blocker_user_id = ? AND blocked_user_id = ?"
        return db.selectDB([blockerID, blockedID], sql)
    },
    checkReported: async (reporterID, reportedID) => {
        const sql = "SELECT * FROM reported_users WHERE reporter_user_id = ? AND reported_user_id = ?"
        return db.selectDB([reporterID, reportedID], sql)
    },
    checkLiked: async (likerID, likedID) => {
        const sql = "SELECT * FROM liked_profiles WHERE liker_user_id = ? AND liked_user_id = ?"
        return db.selectDB([likerID, likedID], sql)
    },
    checkVisited: async (visiterID, visitedID) => {
        const sql = "SELECT * FROM visited_profiles WHERE visitor_user_id = ? AND visited_user_id = ?"
        return db.selectDB([visiterID, visitedID], sql)
    },
    updatePassword: async (password, value, str) => {
        const sql = `UPDATE users SET password = ? WHERE ${str} = ?`;
        return db.updateDB([password, value], sql)
    },
    addLike: async (data) => {
        const sql = 'INSERT INTO liked_profiles SET ?';
        return db.updateDB(data, sql)
    },
    deleteLike: async (likerID, likedID) => {
        const sql = 'DELETE FROM liked_profiles WHERE liker_user_id = ? AND liked_user_id = ?';
        return db.updateDB([likerID, likedID], sql)
    },
    addBlock: async (data) => {
        const sql = 'INSERT INTO blocked_users SET ?';
        return db.updateDB(data, sql)
    },
    deleteBlock: async (blockerID, blockedID) => {
        const sql = 'DELETE FROM blocked_users WHERE blocker_user_id = ? AND blocked_user_id = ?';
        return db.updateDB([blockerID, blockedID], sql)
    },
    addReport: async (data) => {
        const sql = 'INSERT INTO reported_users SET ?';
        return db.updateDB(data, sql)
    },
    addVisit: async (data) => {
        const sql = 'INSERT INTO visited_profiles SET ?';
        return db.updateDB(data, sql)
    },
    updateVisit: async (visiterID, visitedID) => {
        const sql = 'UPDATE visited_profiles SET nbr_visits = nbr_visits + 1 WHERE visitor_user_id = ? AND visited_user_id = ?';
        return db.updateDB([visiterID, visitedID], sql)
    },
    checkLikeRelation: async (likerID, likedID) => {
        const sql = "SELECT * FROM liked_profiles WHERE liker_user_id = ? OR liked_user_id = ?"
        return db.selectDB([likerID, likedID], sql)
    },
    calculateFame: async (id) => {
        const sql = `SELECT count(*) as totalUsers, (((SELECT count(*) as likes FROM liked_profiles WHERE liked_user_id = ?) +` +
        `(SELECT count(*) as visits FROM visited_profiles WHERE visited_user_id = ?)) - ` +
        `((SELECT count(*) as blocks FROM blocked_users WHERE blocked_user_id = ?) + ` +
        `(SELECT count(*) as reports FROM reported_users WHERE reported_user_id = ?))) as sum FROM users`
        return db.selectDB([id, id, id, id], sql)
    },
    likersUsers : async (likedID) => {
        const sql = "SELECT liker_user_id, liked_user_id, u.firstName, u.lastName,u.username, u.profilePic FROM liked_profiles li " +
        "INNER JOIN users u ON u.id = liker_user_id AND liked_user_id = ? ORDER BY li.created_at DESC"
        return db.selectDB([likedID], sql)
    },
    visitorsUsers : async (visitadID) => {
        const sql = "SELECT visitor_user_id, visited_user_id, nbr_visits, u.firstName, u.lastName,u.username, u.profilePic FROM visited_profiles vi " +
        "INNER JOIN users u ON u.id = visitor_user_id AND visited_user_id = ? ORDER BY vi.created_at DESC"
        return db.selectDB([visitadID], sql)
    },
    likedUsers : async (likedID) => {
        const sql = "SELECT liker_user_id, liked_user_id, u.firstName, u.lastName,u.username, u.profilePic FROM liked_profiles li " +
        "INNER JOIN users u ON u.id = liked_user_id AND liker_user_id = ? ORDER BY li.created_at DESC"
        return db.selectDB([likedID], sql)
    },

}

module.exports = user;