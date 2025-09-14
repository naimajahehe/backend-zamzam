# User API Spec
* Get
* Update
* Update Password
* Logout

## Get User
**Endpoint :** `GET /api/users`  
**Authorization :** `X-API-TOKEN`

### Response Body (success) :

```json
{
  "success": true,
  "message": "Get user data successfully",
  "data": {
    "email": "naimmnaim123@gmail.com",
    "username": "naimmnaim123",
    "firstName": "Muhammad",
    "lastName": "Naim"
  }
}
```

### Response Body (failed) :

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "User not found"
}
```
## Update User
**Endpoint :** `PATCH /api/users`  
**Authorization :** `X-API-TOKEN`

### Request Body :

```json
{
  "firstName": "Muhammad",
  "lastName": "Naim",
  "email": "naimmnaim123@gmail.com",
  "username": "naimmnaim123"
}
```

### Response Body (success) :

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "email": "naimmnaim123@gmail.com",
    "username": "naimmnaim123",
    "firstName": "Muhammad",
    "lastName": "Naim"
  }
}
```

### Response Body (failed) :
1. Email is already in use

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Email is already in use"
}
```

2. Username is already in use

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Username is already in use"
}
```

## Update Password User
**Endpoint :** `PATCH /api/users/password`  
**Authorization :** `X-API-TOKEN`

### Request Body :

```json
{
  "oldPassword": "asdfzxcv123",
  "newPassword": "gravesmain123",
  "confirmPassword": "gravesmain123"
}
```

### Response Body (success) :

```json
{
  "success": true,
  "message": "Update password successfully",
  "data": null,
  "errors": null
}
```

### Response Body (failed) :
1. Password do not match

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Password do not match"
}
```

2. New password cannot be the same as the old password

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "New password cannot be the same as the old password",
}
```
## Logout
**Endpoint :** `POST /api/users/logout`  
**Authorization :** `X-API-TOKEN`

### Response Body (success) :

```json
{
  "success": true,
  "message": "User logged out successfully",
  "data": null,
  "errors": null
}
```


