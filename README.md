## I'm using redis as a persisitence data store
# UserManagementAPI

## Overview

This API application provides various functions aimed at improving knowledge and practices when working with different data sources.

## Functionality

### 1. User Registration

- Users can register, and their account information is stored in MongoDB.

### 2. User Login

- When a user logs in, the login time is recorded using Redis.
- This login data is then transferred from Redis to MySQL.

### 3. Admin Insights

- Administrators have the ability to view data regarding the most regular times when users use the application.

## How to Run

To run the application, use Docker Compose:

## How to Try Using GraphQL Playground

# User Signup
```graphql
mutation {
  signup(
    signupInput: {
      name: "someName",
      email: "someEmail",
      password: "somePass"
    }
  ) {
    _id
    name
    email
  }
}

# User Login
```graphql
mutation LoginUser {
  login(loginInput: {
    email: "someEmail",
    name: "someName",
    password: "somePass"
  }) {
    access_token
    user {
      _id
      email
      name
    }
  }
}

# Get User Logs
```graphql
query GetUserLogs {
  userLogs(userId: "someId") {
    id
    userId
    loginTime
    mostFrequentTime
  }
}

# Get Most Frequent Login Time Of User By Id
```graphql
query GetMostFrequentLoginTime {
  getMostFrequentLoginTime(userId: "someId") {
    userId
    mostFrequentTime
  }
}


```bash
docker-compose up
