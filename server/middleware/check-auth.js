const jwt = require('jsonwebtoken');
const chalk = require('chalk');

module.exports = (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // console.log(chalk.magenta("token " + token));
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        // req.userData = decoded;
        // console.log(chalk.blue(JSON.stringify(decoded)));
        req.userData = {
            "userId": 1,
            "username":"asmansou",
            "email":"xidabev790@itiomail.com"
        }
        next();
    } catch (error) {
        return res.status(401).send({
            errorMessage: 'Authentification failed'
        });
    }
};

// module.exports = async (req, res, next) => {
//     const token = req.cookies.token || '';
//     console.log(chalk.magenta("token " + token));
//     try {
//       if (!token) {
//         console.log(chalk.redBright('token non existant'));
//         return res.status(401).json('You need to Login')
//       }
//       const decoded = await jwt.verify(token, process.env.JWT_KEY);
//       req.userData = decoded;
//       console.log(chalk.redBright(decoded));
//       next();
//     } catch (err) {
//       console.log(chalk.redBright('Error' + err));
//       return res.status(500).json(err.toString());
//     }
//   };