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
    verifyUsernameExists: async (username) => {
        const sql = 'SELECT count(username) as count FROM users WHERE username = ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, username, (err,result) => {
               if(err) {
                    console.log(chalk.redBright('Error Selecting username!!'));
                    reject(err);
               }
               else
               {
                   const data = JSON.parse(JSON.stringify(result));
                   resolve(data);
               }
           });
       })
    },

}

module.exports = Auth;