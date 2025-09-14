# Authentication API
- Register
- Login

## Register User

**Endpoint** : `POST /api/users`  
**Status Code (success)** : `201 Created`  
**Status Code (failed)** : `400 Bad Request`

### Request Body :

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

### Response Body (success) :

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

**Endpoint** : `POST /api/users`  
**Status Code (success)** : `200 OK`  
**Status Code (failed)** : `400 Bad Request`

### Request Body :

```json
{
  "username": "naimmnaim123",
  "password": "asdfzxcv123"
}
```

### Response Body (success) :

```json
{
  "success": true,
  "message": "User login successfully",
  "data": {
    "email": "naimmnaim123@gmail.com",
    "username": "naimmnaim123",
    "firstName": "Muhammad",
    "lastName": "Naim",
    "token": "xxx"
  },
  "errors": null
}
```

### Response Body (failed) :

```json
{
  "success": true,
  "message": "request error",
  "data": null,
  "errors": "Incorrect username or password"
}
```