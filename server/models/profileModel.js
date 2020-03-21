const conn = require('../config/database');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const db = require('../models/databaseModel')

const Auth = {
    updatePassword: async (password, token) => {
        const sql = 'UPDATE users SET password = ? WHERE token = ?';
        return db.updateDB([password, token], sql)
    },
    updatebasic: async (firstName, lastName, username, email, gender, orientation, birthDay, bio, id) => {
        const sql = 'UPDATE users SET firstName = ?, lastName = ?, username = ?, email = ?, gender_id = ?, '+
        'preference_id = ?, born_date = ?, biography = ? WHERE id = ?';
        return db.updateDB([firstName, lastName, username, email, gender, orientation, birthDay, bio, id], sql)
    },
    // addTags: async () => {
    //     const sql = 'INSERT INTO tags (title, created_at) \
    //     SELECT  @title,@SoftwareType \
    //     WHERE NOT EXISTS \
    //             (   SELECT  1 \
    //                 FROM    tblSoftwareTitles \
    //                 WHERE   title = @title \
    //                 AND     created_at = @Softwaretype);'
    // }

}

module.exports = Auth;