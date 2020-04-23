const db = require('../models/databaseModel')

const browse = {
    getUsers: async (id) => {
        const sql = `SELECT id, username, firstName, lastName, gender, preference, biography, ` +
        `latitude, longitude, profilePic, is_online as online, last_connection, DATE_FORMAT(born_date, "%Y-%m-%d") as born_date, ` +
        `(SELECT GROUP_CONCAT(name SEPARATOR ',') FROM tags WHERE user_id = users.id) as tags FROM users WHERE id != ? AND ` +
        `id NOT IN  (SELECT blocked_user_id FROM blocked_users  WHERE blocker_user_id = ?) AND `+
        `id NOT IN  (SELECT blocker_user_id FROM blocked_users  WHERE blocked_user_id = ?) AND `+
        `id NOT IN  (SELECT reported_user_id FROM reported_users  WHERE reporter_user_id = ?)`;
        return db.selectDB([id, id, id, id], sql)
    },
}

module.exports = browse