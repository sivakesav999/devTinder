# DevTinder API's

## AuthRouter
- POST /signup
- POST /login
- POST /logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password - change password API

## ConnectionRequestRouter
- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requestId

## UserRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed  - Shows you the profiles of other users on platform
- Pagination - .skip().limit() - Feed API

Status - Ignored, Interested, Accepted & Rejected.