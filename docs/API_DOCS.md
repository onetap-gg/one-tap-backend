# OneTap API Documentation

## User APIs

### Get Basic User Info

- **Endpoint**: `GET /user/basic-info/:authId`
- **Description**: Retrieves basic information for a user
- **Response Sample**:

```json
{
  "userId": "123",
  "userName": "JohnDoe",
  "profilePicture": "https://example.com/profile.jpg",
  "userCustomId": "JD123",
  "profileName": "John",
  "globalRanking": 150,
  "balance": 1000,
  "level": 5,
  "premiumUser": true
}
```

### Get Profile Info

- **Endpoint**: `GET /user/profile-info/:userId`
- **Description**: Retrieves detailed profile information for a user
- **Response Sample**:

```json
{
  "userId": "123",
  "userName": "JohnDoe",
  "profilePicture": "https://example.com/profile.jpg",
  "userCustomId": "JD123",
  "profileName": "John",
  "globalRanking": 150,
  "balance": 1000,
  "level": 5,
  "premiumUser": true,
  "achievements": [],
  "friends": [],
  "gameStats": {}
}
```

### Get User ID

- **Endpoint**: `GET /user/user-id/:authId`
- **Description**: Retrieves user ID from auth ID
- **Response Sample**:

```json
{
  "userId": "123"
}
```

### Update Profile Info

- **Endpoint**: `PUT /user/profile-info/:userId`
- **Request Body**:

```json
{
  "userName": "NewName",
  "profilePicture": "https://example.com/new-profile.jpg",
  "profileName": "New Profile Name"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Create User Profile

- **Endpoint**: `POST /user/create-profile`
- **Request Body**:

```json
{
  "authId": "auth123",
  "userName": "JohnDoe",
  "profilePicture": "https://example.com/profile.jpg",
  "userCustomId": "JD123"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "userId": "123",
  "message": "Profile created successfully"
}
```

### Check User Exists

- **Endpoint**: `GET /user/check-user-exists/:authId`
- **Description**: Checks if a user exists in the system
- **Response Sample**:

```json
{
  "exists": true,
  "userId": "123"
}
```

### Get All Users Basic Info

- **Endpoint**: `GET /user/all/basic-info`
- **Description**: Retrieves basic information for all users
- **Response Sample**:

```json
[
  {
    "userId": "123",
    "userName": "JohnDoe",
    "profilePicture": "https://example.com/profile.jpg",
    "userCustomId": "JD123",
    "profileName": "John",
    "globalRanking": 150,
    "balance": 1000,
    "level": 5,
    "premiumUser": true
  }
]
```

### Get Daily Access Credits

- **Endpoint**: `POST /user/daily-access-credits`
- **Request Body**:

```json
{
  "userId": "123"
}
```

- **Response Sample**:

```json
{
  "message": "Daily reward claimed successfully",
  "balance": 1100
}
```

### Get Last Reward Timestamp

- **Endpoint**: `GET /user/last-reward/:userId`
- **Description**: Retrieves the timestamp of the last daily reward claim
- **Response Sample**:

```json
{
  "lastRewardTimestamp": "2024-03-20T10:30:00Z"
}
```

### Get Coins Summary

- **Endpoint**: `POST /user/coins-summary`
- **Request Body**:

```json
{
  "userId": "123"
}
```

- **Response Sample**:

```json
{
  "totalEarned": 5000,
  "totalSpent": 3000,
  "currentBalance": 2000,
  "transactions": [
    {
      "type": "earn",
      "amount": 100,
      "timestamp": "2024-03-20T10:30:00Z",
      "source": "daily_reward"
    }
  ]
}
```

## Challenge APIs

### Get All Challenges

- **Endpoint**: `GET /challenges/all-data`
- **Description**: Retrieves all challenges
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "status": "active",
    "startDate": "2024-03-20T00:00:00Z",
    "endDate": "2024-03-27T00:00:00Z"
  }
]
```

### Get Ongoing Challenges

- **Endpoint**: `GET /challenges/ongoing-challenges/:gameId`
- **Description**: Retrieves ongoing challenges for a specific game
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "progress": 3,
    "endDate": "2024-03-27T00:00:00Z"
  }
]
```

### Get Completed Challenges

- **Endpoint**: `GET /challenges/completed-challenges/:gameId/:userId`
- **Description**: Retrieves completed challenges for a user in a specific game
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "completedAt": "2024-03-25T15:30:00Z"
  }
]
```

### Calculate Challenges Completed

- **Endpoint**: `POST /challenges/calculate-completed`
- **Request Body**:

```json
{
  "userId": "123",
  "gameId": "1",
  "challengeId": "1"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Challenge completed successfully",
  "reward": 500
}
```

### Upload Challenges

- **Endpoint**: `POST /challenges/upload`
- **Request Body**:

```json
{
  "title": "New Challenge",
  "description": "Challenge description",
  "reward": 500,
  "startDate": "2024-03-20T00:00:00Z",
  "endDate": "2024-03-27T00:00:00Z",
  "requirements": {
    "type": "wins",
    "count": 5
  }
}
```

- **Response Sample**:

```json
{
  "success": true,
  "challengeId": "1",
  "message": "Challenge created successfully"
}
```

### Get Challenge Progress

- **Endpoint**: `GET /challenges/progress/:challengeId/:userId`
- **Description**: Retrieves progress for a specific challenge
- **Response Sample**:

```json
{
  "challengeId": "1",
  "progress": 3,
  "total": 5,
  "percentage": 60
}
```

### Edit Challenge

- **Endpoint**: `PUT /challenges/edit/:challengeId`
- **Request Body**:

```json
{
  "title": "Updated Challenge",
  "description": "Updated description",
  "reward": 600,
  "endDate": "2024-03-28T00:00:00Z"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Challenge updated successfully"
}
```

### Delete Challenge

- **Endpoint**: `DELETE /challenges/delete/:challengeId`
- **Description**: Deletes a specific challenge
- **Response Sample**:

```json
{
  "success": true,
  "message": "Challenge deleted successfully"
}
```

### Get All Ongoing Challenges

- **Endpoint**: `GET /challenges/all-ongoing-challenges`
- **Description**: Retrieves all ongoing challenges across all games
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "progress": 3,
    "endDate": "2024-03-27T00:00:00Z"
  }
]
```

### Get All Completed Challenges

- **Endpoint**: `GET /challenges/all-completed-challenges/:userId`
- **Description**: Retrieves all completed challenges for a user
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "completedAt": "2024-03-25T15:30:00Z"
  }
]
```

### Get Ended Challenges

- **Endpoint**: `GET /challenges/ended-challenges/:gameId`
- **Description**: Retrieves ended challenges for a specific game
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "endDate": "2024-03-20T00:00:00Z"
  }
]
```

### Get All Ended Challenges

- **Endpoint**: `GET /challenges/all-ended-challenges`
- **Description**: Retrieves all ended challenges across all games
- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "title": "Win 5 Games",
    "description": "Win 5 games in any game mode",
    "reward": 500,
    "endDate": "2024-03-20T00:00:00Z"
  }
]
```

### Get Multiple Challenge Progress

- **Endpoint**: `POST /challenges/multiple-progress`
- **Request Body**:

```json
{
  "userId": "123",
  "challengeIds": ["1", "2", "3"]
}
```

- **Response Sample**:

```json
[
  {
    "challengeId": "1",
    "progress": 3,
    "total": 5,
    "percentage": 60
  }
]
```

### Get Challenges Grouped By Level

- **Endpoint**: `GET /challenges/grouped-by-level`
- **Description**: Retrieves challenges grouped by difficulty level
- **Response Sample**:

```json
{
  "beginner": [
    {
      "challengeId": "1",
      "title": "Win 5 Games",
      "description": "Win 5 games in any game mode",
      "reward": 500
    }
  ],
  "intermediate": [],
  "advanced": []
}
```

## Marketplace APIs

### Get Coupons

- **Endpoint**: `GET /marketplace/get-coupons`
- **Description**: Retrieves all available coupons
- **Response Sample**:

```json
[
  {
    "couponId": "1",
    "code": "WELCOME50",
    "discount": 50,
    "validUntil": "2024-12-31T23:59:59Z",
    "isActive": true
  }
]
```

### Set Coupon

- **Endpoint**: `POST /marketplace/set-coupon`
- **Request Body**:

```json
{
  "code": "WELCOME50",
  "discount": 50,
  "validUntil": "2024-12-31T23:59:59Z"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Coupon created successfully"
}
```

### Redeem Coupon

- **Endpoint**: `POST /marketplace/redeem-coupons`
- **Request Body**:

```json
{
  "userId": "123",
  "couponCode": "WELCOME50"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Coupon redeemed successfully",
  "newBalance": 1050
}
```

### Delete Coupon

- **Endpoint**: `DELETE /marketplace/delete-coupon/:couponId`
- **Description**: Deletes a specific coupon
- **Response Sample**:

```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### Edit Coupon

- **Endpoint**: `PUT /marketplace/edit-coupon/:couponId`
- **Request Body**:

```json
{
  "discount": 60,
  "validUntil": "2024-12-31T23:59:59Z",
  "isActive": true
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Coupon updated successfully"
}
```

### Count Coupon By Name

- **Endpoint**: `GET /marketplace/count-coupon/:code`
- **Description**: Retrieves the count of a specific coupon code
- **Response Sample**:

```json
{
  "count": 5,
  "code": "WELCOME50"
}
```

## Subscription APIs

### Get Subscriptions

- **Endpoint**: `GET /subscriptions`
- **Description**: Retrieves all subscription plans
- **Response Sample**:

```json
[
  {
    "subscriptionId": "1",
    "name": "Premium Monthly",
    "price": 9.99,
    "duration": 30,
    "features": ["No Ads", "Exclusive Content", "Priority Support"]
  }
]
```

### Set Subscription

- **Endpoint**: `POST /subscriptions`
- **Request Body**:

```json
{
  "userId": "123",
  "subscriptionId": "1",
  "paymentMethod": "credit_card"
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Subscription activated successfully",
  "expiryDate": "2024-04-20T00:00:00Z"
}
```

### Delete Subscription

- **Endpoint**: `DELETE /subscriptions/:subscriptionId`
- **Description**: Deletes a specific subscription
- **Response Sample**:

```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

### Edit Subscription

- **Endpoint**: `PUT /subscriptions/:subscriptionId`
- **Request Body**:

```json
{
  "name": "Premium Yearly",
  "price": 99.99,
  "duration": 365,
  "features": [
    "No Ads",
    "Exclusive Content",
    "Priority Support",
    "Early Access"
  ]
}
```

- **Response Sample**:

```json
{
  "success": true,
  "message": "Subscription updated successfully"
}
```

### Deactivate Subscription

- **Endpoint**: `PUT /subscriptions/deactivate/:subscriptionId`
- **Description**: Deactivates a specific subscription
- **Response Sample**:

```json
{
  "success": true,
  "message": "Subscription deactivated successfully"
}
```

## Games APIs

### Get All Games

- **Endpoint**: `GET /games`
- **Description**: Retrieves all available games
- **Response Sample**:

```json
[
  {
    "gameId": "1",
    "name": "Game Title",
    "description": "Game description",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isActive": true
  }
]
```

## Leaderboard APIs

### Get Global Leaderboard

- **Endpoint**: `GET /leaderboard/global`
- **Description**: Retrieves global leaderboard data
- **Response Sample**:

```json
[
  {
    "userId": "123",
    "userName": "JohnDoe",
    "score": 15000,
    "rank": 1,
    "profilePicture": "https://example.com/profile.jpg"
  }
]
```

### Get Game-Specific Leaderboard

- **Endpoint**: `GET /leaderboard/game/:gameId`
- **Description**: Retrieves leaderboard data for a specific game
- **Response Sample**:

```json
[
  {
    "userId": "123",
    "userName": "JohnDoe",
    "score": 15000,
    "rank": 1,
    "profilePicture": "https://example.com/profile.jpg"
  }
]
```

## Inventory APIs

### Get All Inventory Info

- **Endpoint**: `GET /inventory/all`
- **Description**: Retrieves all inventory items
- **Response Sample**:

```json
[
  {
    "itemId": "1",
    "name": "Item Name",
    "description": "Item description",
    "type": "cosmetic",
    "rarity": "rare"
  }
]
```

### Get User Inventory

- **Endpoint**: `GET /inventory/user/:userId`
- **Description**: Retrieves inventory items for a specific user
- **Response Sample**:

```json
[
  {
    "itemId": "1",
    "name": "Item Name",
    "description": "Item description",
    "type": "cosmetic",
    "rarity": "rare",
    "acquiredAt": "2024-03-20T10:30:00Z"
  }
]
```
