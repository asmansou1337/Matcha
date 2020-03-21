const jwt = require("jsonwebtoken");

const authToken = {
    createNewAuthToken: (id, username, email) => {
        const token = jwt.sign(
            {
                userId: id,
                username,
                email
            },
            process.env.JWT_KEY,
            { expiresIn: "12h" }
          )
        return token
    }
}

module.exports = authToken