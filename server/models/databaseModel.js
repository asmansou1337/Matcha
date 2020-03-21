const conn = require('../config/database');
const chalk = require('chalk');

const db = {
    selectDB: async (value, sql) => {
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, value, (err,result) => {
               if(err) {
                    console.log(chalk.redBright('Error Selecting!!'));
                    reject(err);
               }
               else
               {
                   resolve(JSON.parse(JSON.stringify(result)));
               }
           });
       })
    },
    updateDB: async (data, sql) => {
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, data, (err) => {
               if(err) {
                    console.log(chalk.redBright('Error Updating!!'));
                    console.log(chalk.redBright(err));
                    reject(err);
               }
               else
               {
                   resolve(true);
               }
           });
       })
    },
    insertdb: async (data, sql) => {
        return new Promise ((resolve, reject) =>  {
            conn.query(sql, data, (err) => {
               if(err) {
                    console.log(chalk.redBright('Error Inserting!!'));
                    reject(err);
               }
               else
                    resolve(true);
           });
       })
    },
}

module.exports = db