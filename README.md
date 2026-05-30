# Full Authentication - Production-Level TRPC Monorepo

A production-grade authentication system built with **TRPC**, **TypeScript**, **MongoDB**, **Redis**, and **Turborepo**. This monorepo provides a complete authentication solution with end-to-end type safety and scalable infrastructure.

## 📋 Overview

This project implements a full-featured authentication system designed for production use. It leverages TRPC for type-safe API routes, MongoDB for persistent storage, and Redis for caching and session management.

### Key Features

- 🔐 **Secure Authentication** - JWT-based authentication with refresh token mechanism
- 🚀 **Type-Safe APIs** - End-to-end type safety with TRPC
- 📊 **MongoDB Integration** - Persistent user data storage
- ⚡ **Redis Caching** - Fast session and data caching
- 🛡️ **Rate Limiting** - Protected TRPC endpoints with rate limiting
- 📚 **API Documentation** - Auto-generated route documentation at `localhost:4000/docs`

## 🏗️ Project Structure

### Apps
- **server** - Main Node.js/Express server with TRPC endpoints

### Packages
- **auth** - Authentication service (JWT, cookies, auth logic)
- **database** - MongoDB models and utilities
- **redis** - Redis client and utilities
- **trpc** - TRPC configuration, procedures, and routes
- **env** - Environment configuration
- **eslint-config** - Shared ESLint configurations
- **typescript-config** - Shared TypeScript configurations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and pnpm
- MongoDB
- Redis

### Installation

```sh
# Install dependencies
pnpm install

# Set up environment variables
# Copy .env.example to .env and configure your MongoDB and Redis connections
```

### Development

1. **Start Redis** (from the packages/redis directory):

```sh
cd packages/redis
docker compose up -d
```

2. **Start the development server** with hot reload:

```sh
pnpm run dev
```

This starts the authentication server at `localhost:4000`.

### View API Documentation

Once the server is running, visit:

```
http://localhost:4000/docs
```

All available routes and endpoints are documented here.

## 🔒 Rate Limiting

- **Rate limiting is applied to `/trpc` endpoints** to prevent abuse in production
- **No rate limiting on `/api` endpoints** to allow easy testing and route inspection during development


## 📦 Technology Stack

- **TRPC** - Type-safe API framework
- **TypeScript** - Static type checking
- **MongoDB** - NoSQL database
- **Redis** - In-memory cache and session store
- **Turborepo** - Monorepo build system
- **Express** - Web framework
- **JWT** - Token-based authentication

