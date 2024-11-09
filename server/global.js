const jwt = require('jsonwebtoken');

const SECRET_TOKEN_KEY = "GK^8#yf&2%9Aq3j!Pz*6nL@WsBdE$5tY"


function authenticate_token(req) {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) return false
    const verify = jwt.verify(token, SECRET_TOKEN_KEY)
    if (verify.email) return true
    return false
}

module.exports = { authenticate_token, SECRET_TOKEN_KEY }