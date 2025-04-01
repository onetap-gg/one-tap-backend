# OneTap Codebase Documentation

## Overview

OneTap is a gaming platform that provides various features including user management, subscriptions, marketplace, and game-specific requirements. The codebase is built using TypeScript and follows a DAO (Data Access Object) pattern for database operations.

## Project Structure

```
src/
├── User/                 # User management
│   ├── Controllers/     # User-related API endpoints
│   ├── Dao/            # User data access layer
│   └── Types/          # User-related type definitions
├── subscriptions/       # Subscription management
│   ├── Controllers/    # Subscription-related API endpoints
│   └── Dao/           # Subscription data access layer
├── MarkitPlace/        # Marketplace functionality
│   ├── Controllers/   # Marketplace-related API endpoints
│   └── Dao/          # Marketplace data access layer
├── utils/             # Utility classes and functions
│   ├── Classes/      # Base classes (including DAO)
│   └── ChallengeRequirement/  # Game-specific requirements
└── db/               # Database configuration
```

## Core Components

### 1. Base DAO Class

Located in `src/utils/Classes/Dao.ts`, this is the foundation for all data access operations. It provides:

- Error handling
- Logging functionality
- Database connection management

### 2. User Management

The user system handles:

- User authentication
- Profile management
- Balance tracking
- Premium status

Key files:

- `src/User/Dao/userDao.ts`: Core user data operations
- `src/User/Controllers/*.ts`: API endpoints for user operations

### 3. Subscription System

Manages user subscriptions and premium features:

- Subscription creation and management
- Subscription status tracking
- Premium feature access control

Key files:

- `src/subscriptions/Dao/subscriptionsDao.ts`: Subscription data operations
- `src/subscriptions/Controller/*.ts`: Subscription-related API endpoints

### 4. Marketplace

Handles the platform's marketplace functionality:

- Coupon management
- Item redemption
- Balance transactions

Key files:

- `src/MarkitPlace/Dao/MarkitDao.ts`: Marketplace data operations
- `src/MarkitPlace/Controller/*.ts`: Marketplace-related API endpoints

## Database Schema

### User Table

- `userId`: Primary key
- `userName`: User's display name
- `profilePicture`: User's profile image URL
- `userCustomId`: Custom identifier
- `profileName`: Profile display name
- `globalRanking`: User's global rank
- `balance`: User's current balance
- `Auth`: Authentication identifier
- `level`: User's current level
- `premiumUser`: Premium status flag

### UserGame Table

- `id`: Primary key
- `userId`: Foreign key to User table
- `isFav`: Favorite status
- `gameId`: Foreign key to Game table
- `totalPlayingHours`: Total hours played
- `gameWon`: Number of games won
- `gameLoss`: Number of games lost
- `gameBalance`: Game-specific balance

## Logging System

The codebase implements a comprehensive logging system:

- Method call logging
- Result logging
- Error logging
- Database operation logging

All logs are prefixed with `[DAO]` for easy identification in the logs.

## Error Handling

The system implements a robust error handling mechanism:

- Custom error throwing
- Error logging
- Error type checking
- JSON error serialization

## Best Practices

1. Always use the DAO pattern for database operations
2. Implement proper error handling using the base DAO's `throwError` method
3. Use logging for debugging and monitoring
4. Follow TypeScript type definitions strictly
5. Keep controllers thin and move business logic to DAOs

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Follow the existing code structure
2. Add appropriate logging
3. Update documentation for new features
4. Test thoroughly before submitting PRs

## Troubleshooting

Common issues and solutions:

1. Database connection issues: Check environment variables
2. Authentication problems: Verify Auth token format
3. Logging issues: Check server logs for `[DAO]` prefixed messages
