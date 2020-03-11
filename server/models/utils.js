const bcrypt = require('bcrypt');

let hashPassword = await bcrypt.hash(password, 10);
