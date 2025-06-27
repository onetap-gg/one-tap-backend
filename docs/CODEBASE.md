# OneTap Codebase Documentation

## Overview

OneTap is a gaming platform that provides various features including user management, subscriptions, marketplace, and game-specific requirements. The codebase is built using TypeScript and follows a DAO (Data Access Object) pattern for database operations.

## Project Structure

```
src/
├── User/                 # User management
│   ├── Controllers/     # User-related API endpoints
│   ├── Dao/            # User data access layer
│   ├── Router/         # User route definitions
│   └── Types/          # User-related type definitions
├── subscriptions/       # Subscription management
│   ├── Controllers/    # Subscription-related API endpoints
│   ├── Router/         # Subscription route definitions
│   └── Dao/           # Subscription data access layer
├── MarkitPlace/        # Marketplace functionality
│   ├── Controllers/   # Marketplace-related API endpoints
│   ├── Router/        # Marketplace route definitions
│   └── Dao/          # Marketplace data access layer
├── challenges/         # Challenge system
│   ├── Controllers/   # Challenge-related API endpoints
│   ├── Router/        # Challenge route definitions
│   └── Dao/          # Challenge data access layer
├── Games/             # Game management
│   ├── Controllers/   # Game-related API endpoints
│   ├── Routes/        # Game route definitions
│   └── Dao/          # Game data access layer
├── LeaderBoard/       # Leaderboard system
│   ├── Controllers/   # Leaderboard-related API endpoints
│   ├── Routers/       # Leaderboard route definitions
│   └── Dao/          # Leaderboard data access layer
├── utils/             # Utility classes and functions
│   ├── Classes/      # Base classes (including DAO)
│   ├── interfaces/   # TypeScript interfaces
│   └── ChallengeRequirement/  # Game-specific requirements
└── db/               # Database configuration
```

## Core Components

### 1. Base DAO Class

Located in `src/utils/Classes/Dao.ts`, this is the foundation for all data access operations. It provides:

- Error handling
- Logging functionality
- Database connection management
- Transaction support
- Query building utilities

### 2. User Management

The user system handles:

- User authentication
- Profile management
- Balance tracking
- Premium status
- Daily rewards
- User statistics

Key files:

- `src/User/Dao/userDao.ts`: Core user data operations
- `src/User/Controllers/*.ts`: API endpoints for user operations
- `src/User/Router/userRouter.ts`: User route definitions

### 3. Subscription System

Manages user subscriptions and premium features:

- Subscription creation and management
- Subscription status tracking
- Premium feature access control
- Payment processing
- Subscription renewal

Key files:

- `src/subscriptions/Dao/subscriptionsDao.ts`: Subscription data operations
- `src/subscriptions/Controller/*.ts`: Subscription-related API endpoints
- `src/subscriptions/Router/subscripitonsRouter.ts`: Subscription route definitions

### 4. Marketplace

Handles the platform's marketplace functionality:

- Coupon management
- Item redemption
- Balance transactions
- Purchase history
- Discount management

Key files:

- `src/MarkitPlace/Dao/MarkitDao.ts`: Marketplace data operations
- `src/MarkitPlace/Controller/*.ts`: Marketplace-related API endpoints
- `src/MarkitPlace/Router/martkitPlacerouter.ts`: Marketplace route definitions

### 5. Challenge System

Manages gaming challenges and rewards:

- Challenge creation and management
- Progress tracking
- Reward distribution
- Challenge completion verification
- Challenge categories and levels

Key files:

- `src/challenges/Dao/challengesDao.ts`: Challenge data operations
- `src/challenges/Controllers/*.ts`: Challenge-related API endpoints
- `src/challenges/Routers/challengesRouter.ts`: Challenge route definitions

### 6. Leaderboard System

Handles player rankings and statistics:

- Global rankings
- Game-specific rankings
- Score tracking
- Achievement tracking
- Ranking updates

Key files:

- `src/LeaderBoard/Dao/leaderBoardDao.ts`: Leaderboard data operations
- `src/LeaderBoard/Controllers/*.ts`: Leaderboard-related API endpoints
- `src/LeaderBoard/Routers/leaderBoardRouter.ts`: Leaderboard route definitions

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
- `lastRewardTimestamp`: Last daily reward claim time
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### UserGame Table

- `id`: Primary key
- `userId`: Foreign key to User table
- `isFav`: Favorite status
- `gameId`: Foreign key to Game table
- `totalPlayingHours`: Total hours played
- `gameWon`: Number of games won
- `gameLoss`: Number of games lost
- `gameBalance`: Game-specific balance
- `lastPlayed`: Last game session timestamp
- `achievements`: JSON array of achievements

### Challenge Table

- `challengeId`: Primary key
- `title`: Challenge title
- `description`: Challenge description
- `reward`: Reward amount
- `startDate`: Challenge start date
- `endDate`: Challenge end date
- `status`: Challenge status
- `requirements`: JSON object of requirements
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Logging System

The codebase implements a comprehensive logging system:

- Method call logging
- Result logging
- Error logging
- Database operation logging
- Performance monitoring
- Audit trail

All logs are prefixed with `[DAO]` for easy identification in the logs.

## Error Handling

The system implements a robust error handling mechanism:

- Custom error throwing
- Error logging
- Error type checking
- JSON error serialization
- Error recovery strategies
- User-friendly error messages

## Best Practices

1. Always use the DAO pattern for database operations
2. Implement proper error handling using the base DAO's `throwError` method
3. Use logging for debugging and monitoring
4. Follow TypeScript type definitions strictly
5. Keep controllers thin and move business logic to DAOs
6. Use proper HTTP status codes for API responses
7. Implement rate limiting for API endpoints
8. Follow RESTful API design principles
9. Use proper authentication and authorization
10. Implement proper input validation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=onetap_db
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Follow the existing code structure
2. Add appropriate logging
3. Update documentation for new features
4. Test thoroughly before submitting PRs
5. Follow the coding style guide
6. Write unit tests for new features
7. Update API documentation
8. Create meaningful commit messages

## Troubleshooting

Common issues and solutions:

1. Database connection issues: Check environment variables
2. Authentication problems: Verify Auth token format
3. Logging issues: Check server logs for `[DAO]` prefixed messages
4. API errors: Check request/response format
5. Performance issues: Monitor database queries
6. Memory leaks: Check for proper resource cleanup
7. Type errors: Verify TypeScript types
8. Route issues: Check route definitions
