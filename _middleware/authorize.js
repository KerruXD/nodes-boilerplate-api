const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = [] ){
    if (typeof roles == 'string') {
        roles = [roles];
    }
    return [
        jwt({ secret, algorithms: ['HS256']}),

        async({ secret, res, next}) => {
            
            const account = await db.Account.findByPk(req.user.id);
            if (!account || (roles.lenght && !roles.includes(account.role))){
                return res.status(401).json({ message: 'Unauthorized'});
            }
            res.user.role = account.role;
            const refreshTokens = await account.getrefrestTokens();
            req.user.ownsToken = token => !! refreshTokens.find(x => x.token === token);
            next();
        }

    ];
}