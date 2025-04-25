const {validateToken} = require("../services/auth.service")

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue){
            return next()
        }

        try {
            const userPayload = validateToken(tokenCookieValue)
            req.user = userPayload
        } catch (error) {
            console.error("Token Validationn failed", error)
        }
        return next()
    }
}
module.exports = {
    checkForAuthenticationCookie
}