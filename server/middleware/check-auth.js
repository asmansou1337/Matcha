const jwt = require('jsonwebtoken');
const chalk = require('chalk');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).send({
            errorMessage: 'Authentification failed'
        });
    }
};