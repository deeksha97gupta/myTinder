const authentication  = (req, res, next) => {
    const token = 'xyz';
    const isAuth = token === 'xyz';
    if (!isAuth) {
        res.status(401).send('Not authorized')
    }
    next();
}

module.exports = {
    authentication
}