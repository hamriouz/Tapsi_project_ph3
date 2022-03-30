const ApiGroups = require('./ApiGroups');
const UserDomain = require("../../Handler/Organizer");

class AccessManager {
    //todo
    static validateAccess(req, res, next) {
        const {role: tokenRole} = req;
        if (ApiGroups[tokenRole] && ApiGroups[tokenRole].routes.some(route => req.route === route)) {
            const email = req.userEmail;
            const tokenRole = req.userRole;
            const user = UserDomain.getOrganizer(email)
            const userRole = UserDomain.getRole(email)
            const userStatus = UserDomain.getStatus(email)

            if (user) {
                if (userRole !== tokenRole)
                    res.status(403).send("Your role was changed! Logout and login again")
                if (userStatus === "disable")
                    res.status(403).send("Your account was disabled! You don't have the permission to take this action!")
            }
            next();
        }
        res.status(403).send("Access denied! Please login!");
    }

/*    static validateChangedDetail(req, res, next) {
        const email = req.userEmail;
        const tokenRole = req.userRole;
        const user = DataBaseManager.getUserByEmail(email)
        const userRole = DataBaseManager.getRole(email)
        const userStatus = DataBaseManager.getStatus(email)

        if (user) {
            if (userRole !== tokenRole)
                throw "Your role was changed! Logout and login again"
            if (userStatus === "disable")
                throw "Your account was disabled! You don't have the permission to take this action!";
        }
        next();
    }*/
}

module.exports = AccessManager;