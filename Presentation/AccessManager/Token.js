const jwt = require("jsonwebtoken");

class Token {
    //check if someone has logged in and return the user that has logged in!
    static authenticateActor(req, res, next) {
        const token = req.header('Authorization');
        let decoded_token;
        try {
            jwt.verify(token, process.env.TOKEN_KEY, {}, function (err, decoded) {
                if (err)
                    res.status(403).send("Access denied! Please login!");
                decoded_token = decoded //token info is returned in 'decoded'
            })
        } catch (error) {
            res.status(403).send(error);
        }
        req.userEmail = decoded_token.email;
        req.userRole = decoded_token.role;
        next();
    }

    static createToken(email, role) {
        return jwt.sign(
            {
                email: email,
                role: role
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            });
    }

}

module.exports = Token;

/*    static authenticateActor(token) {
        let decoded_token;
        jwt.verify(token, process.env.TOKEN_KEY, {}, function (err, decoded) {
            if (err) throw "Access denied! Please login!"
            decoded_token = decoded //token info is returned in 'decoded'
        })
        return decoded_token.email;
    }*/

/*   static getLoggedInUserRole(token){
       let decoded_token;
       jwt.verify(token, process.env.TOKEN_KEY, {}, function (err, decoded) {
           if (err) throw "Access denied! Please login!"
           decoded_token = decoded //token info is returned in 'decoded'
       })
       return decoded_token.role;

   }*/