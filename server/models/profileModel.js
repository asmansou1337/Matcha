const conn = require('../config/database');
const chalk = require('chalk');
const bcrypt = require('bcrypt');

const Auth = {
    updatePassword: async (password, token) => {
        const sql = 'UPDATE users SET password = ? WHERE token = ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, [password, token], (err) => {
               if(err) {
                    console.log(chalk.redBright('Error Updating password!!'));
                    console.log(chalk.redBright(err));
                    reject(err);
               }
               else
                    resolve(true);
           });
       })
    },

}

module.exports = Auth;