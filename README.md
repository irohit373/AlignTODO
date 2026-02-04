# Align TODO

A minimalist task manager focus on clear structure and secure implementation.

## Live Demo

Check out the live application: [Align TODO](https://align-todo.vercel.app/)


## Tech Stack
- Framework: Next.js 15 (App Router)
- Database: PostgreSQL
- Styling: Tailwind CSS
- Auth: Custom JWT with HttpOnly cookies

## Core Implementation

### 1. Robust Routing and Security
The project uses a centralized middleware layer (`middleware.js`) to manage application state and security:
- Protected Routes: Redirection to login if no valid session is found.
- Guest Protection: Logged-in users are redirected to the dashboard if they attempt to access login or register pages.
- Token Verification: Real-time JWT verification on protected requests using the `jose` library.

### 2. Design Philosophy: Pure Simple Edge
The UI follows a strict "Edge" design system:
- High contrast black and white theme.
- Sharp corners (rounded-none) and bold 2px borders.
- Zero animations or gradients to maximize performance and focus.

### 3. Project Structure
- `src/app`: Routes and API handlers.
- `src/components`: Modular UI elements.
- `src/lib`: Database connection and auth utilities.
- `middleware.js`: Security and routing logic.

## Technical Techniques
- Secure password hashing with bcryptjs.
- Clean REST API implementation (CRUD).
- Responsive layout design without external component libraries.
- Cryptographically signed sessions for state persistence.


