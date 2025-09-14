# Verification Email Session API
- Send Verify Email
- Verify Email
## Send Verify Email User

**Endpoint** : `POST /api/users/send-verify-email`  
**Authorization** : Token JWT

### Response Body (success) :

```json
{
  "success": true,
  "message": "Send email verification successfully",
  "data": null,
  "errors": null
}
```

## Verify Email User
**Endpoint** : `POST /api/users/verify-email`

### Query Parameters
| Name  | Type   | Required | Description                  |
|-------|--------|----------|------------------------------|
| token | string | Yes      | Verification token from email |

### Response Body (success)

```json
{
  "success": true,
  "message": "Email verification successfully",
  "data": null,
  "errors": null
}
```

### Response Body (failed) :

1. Invalid Token
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Invalid Token"
}
```

2. Already Verified
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "User is already verified"
}
```
