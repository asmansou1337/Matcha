const conn = require('../config/database');
const chalk = require('chalk');
const bcrypt = require('bcrypt');

const Auth = {
    register: async (data) => {
        const sql = 'INSERT INTO users SET ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, data, (err) => {
               if(err) {
                    console.log(chalk.redBright('Error Creating new User!!'));
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
    verifyEmailExists: async (email) => {
        const sql = 'SELECT count(email) as count FROM users WHERE email = ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, email, (err, result) => {
               if(err) {
                    console.log(chalk.redBright('Error Selecting email!!'));
                    reject(err);
               }
               else
               {
                   resolve(JSON.parse(JSON.stringify(result)));
               }
           });
       })
    },
    verifyTokenExists: async (token) => {
        const sql = 'SELECT count(token) as count FROM users WHERE token = ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, token, (err, result) => {
               if(err) {
                    console.log(chalk.redBright('Error Selecting token!!'));
                    reject(err);
               }
               else
               {
                   resolve(JSON.parse(JSON.stringify(result)));
                   console.log(chalk.red(JSON.stringify(result)));
               }
           });
       })
    },
    verifyAccountActivated: async (token) => {
        const sql = 'SELECT count(*) as count FROM users WHERE token = ? AND is_active = 1';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, token, (err,result) => {
               if(err) {
                    console.log(chalk.redBright('Error!!'));
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
    activateAccount: async (token) => {
        const sql = 'UPDATE users SET is_active = 1 WHERE token = ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, token, (err) => {
               if(err) {
                    console.log(chalk.redBright('Error activating account!!'));
                    reject(err);
               }
               else
               {
                   resolve(true);
               }
           });
       })
    },
    verifLoginInfo: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, username, (err,result) => {
               if(err) {
                    console.log(chalk.redBright('Error!!'));
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