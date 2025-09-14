# Forgot Password Session API

- Forgot Password
- Verify Code
- Reset Password

## Forgot Password
**Endpoint:** `POST /api/users/forgot-password`

### Request Body :
```json
{
  "email": "naimmnaim123@gmail.com"
}
```

### Response Body (success) :

```json
{
  "success": true,
  "message": "Verification code has been sent to your email",
  "data": null,
  "errors": null
}
```
### Response Body (failed) :
#### 1. Email not found
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Email not found"
}
```
#### 2. Failed to Send Code
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Failed to send verification code"
}
```

## Verify Code
**Endpoint:** `POST /api/users/verify-code`

### Query Parameters
| Name  | Type   | Required | Description        |
|-------|--------|----------|--------------------|
| email | string | Yes      | Verification email |

### Request Body :

```json
{
  "verificationCode": 123123
}
```

### Response Body (success) :

```json
{
  "success": true,
  "message": "Verification code successfully",
  "data": {
    "resetToken": "xxx"
  },
  "errors": null
}
```

### Response Body (failed) :
1. Invalid Code
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Invalid verification code"
}
```
2. Invalid Email
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Email not found"
}
```

3. Verification code is not send
```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Verification code has not been sent"
}
```

## Reset Password
**Endpoint :** `POST /api/users/reset-password`

### Query Parameters
| Name  | Type   | Required | Description            |
|-------|--------|----------|------------------------|
| token | string | Yes      | Token from verify code |

### Request Body :

```json
{
  "newPassword": "asdfzxcv123",
  "confirmPassword": "asdfzxcv123"
}
```

### Response Body (success) :

```json
{
  "success": true,
  "message": "Reset password successfully",
  "data": null,
  "errors": null
}
```

### Response Body (failed) :

1. New password cannot be the same as the old password

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "The new password cannot be the same as the old password"
}
```

2. Invalid Token

```json
{
  "success": false,
  "message": "request error",
  "data": null,
  "errors": "Invalid Token"
}
```