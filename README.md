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
- POST /request/review/:status/:userId // status - accepted, rejected

# UserRouter
- GET /user/connections
- GET /user/request/recevied
- GET /user/feed