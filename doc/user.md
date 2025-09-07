# User API Spec
* Register
* Login
* Verify Email
* Get
* Update
* Update Password
* Forgot Password
* Logout

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "firstName": "Muhammad",
  "lastName": "Naim",
  "email": "naimmnaim123@gmail.com",
  "username": "naimmnaim123",
  "password": "asdfzxcv123",
  "confirmPassword": "asdfzxcv123",
  "gender": "male"
}
```

Response Body (success) :

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "email": "naimmnaim123@gmail.com",
    "username": "naimmnaim123",
    "firstName": "Muhammad",
    "lastName": "Naim"
  },
  "errors": null
}
```

## Login User

## Verify Email User

## Get User

## Update User

## Update Password User

## Forgot Password User

## Logout

