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
  
}
```

## Update Password User

## Logout

