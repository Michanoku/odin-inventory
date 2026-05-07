# Node Express Template

A clean, minimal **Node.js + Express** starter template for building web applications for practice

---

## Features

* Express server setup
* EJS templating engine
* MVC-inspired structure (routes, controllers, views)
* Environment variable support with dotenv
* Security middleware (Helmet)
* Response compression
* Request logging (Morgan)
* Error handling (404 + global handler)
* ESLint for code quality
* Jest + Supertest ready for testing
* Nodemon for development

---

## Setup

### 1. Install dependencies

```
npm install
```

---

### 2. Create `.env` file

```
NODE_ENV=development
```

---

### 3. Run the app

Development:

```
npm run dev
```

Production:

```
npm start
```

---

## Middleware Included

* **Helmet** → Security headers
* **Compression** → Smaller response sizes
* **Morgan** → HTTP request logging
* **Express parsers** → JSON + form handling
* **Static serving** → `/public` directory

---

## Routing

Routes are defined separately and mounted in `app.js`:

```js
app.use("/", indexRoutes);
```

---

## Error Handling

### 404 Handler

Triggered when no route matches.

### Global Error Handler

Catches all errors and renders a shared error view.

---

## Testing

Run tests:

```
npm test
```

Setup uses:

* Jest (test runner)
* Supertest (HTTP testing)

---

## Linting

Run ESLint:

```
npm run lint
```

---

## Scripts

```
npm run dev     # Start with nodemon
npm start       # Production start
npm run lint    # Run ESLint
npm test        # Run tests
```

## License

MIT

---

## Purpose

This template is designed for:

* learning Express fundamentals
* quickly bootstrapping new projects
* serving as a clean, reusable starting point

