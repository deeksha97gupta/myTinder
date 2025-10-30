# myTinder APIs

# AuthRouter
- POST /signup
- POST /login
- POST /logout

# ProfileRouter
- GET /pofile/view
- PATCH /profile/edit
- PATCH /profile/password

# ConnectionRequestRouter
- POST /request/send/:status/:userId  // status - interested, ignored
- POST /request/review/accepted/:userId
- POST /request/review/regected/:userId

# UserRouter
- GET /user/connections
- GET /user/request/recevied
- GET /user/feed