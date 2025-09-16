# Insuppent Frontend

![React](https://img.shields.io/badge/React-18%2B-blue)
![Vite](https://img.shields.io/badge/Vite-Build-lightblue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4)
![License: ISC](https://img.shields.io/badge/License-ISC-lightgrey)

Frontend for the Insuppent platform. This SPA provides user and admin dashboards, lead management, purchasing, authentication, and more.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User and Admin dashboards
- Lead management and purchasing
- Authentication (login, signup, password reset)
- Stripe integration for payments
- Responsive UI with TailwindCSS
- Context-based state management
- API integration with backend
- Modern UI components and layouts
- Material icons and custom SVG assets
- Route-based code splitting
- Debounced search and filtering

---

## Tech Stack
- **React 18+**
- **Vite** (build tool)
- **TailwindCSS** (styling)
- **Axios** (API calls)
- **Stripe** (payments)
- **ESLint & Prettier** (code style)

---

## Project Structure
```
insuppent-fe/
├── public/
│   ├── _redirects
│   ├── Insuplex360.svg
│   └── Insuppent.webp
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── api/
│   │   ├── axios/
│   │   ├── hooks/
│   │   └── services/
│   ├── assets/
│   ├── components/
│   │   ├── ThemeToggle.jsx
│   │   ├── layout/
│   │   ├── pages/
│   │   └── ui/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   └── User/
│   ├── routes/
│   └── utils/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json
├── postcss.config.js
├── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- Backend API running (see [insuppent-be](../insuppent-be))

### Install dependencies
```bash
npm install
```

---

## Configuration
- Update API base URLs in `src/api/axios/config.js` as needed.
- Set environment variables in `.env`.

---

## Running the App

### Development
```bash
npm run dev
```
App runs on `http://localhost:5173` by default.

### Production
```bash
npm run build
npm run preview
```

---

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

---

## Environment Variables

Example `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

## Docker

To build and run with Docker (if configured):
```bash
docker build -t insuppent-fe .
docker run -p 5173:5173 insuppent-fe
```

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

---

## License

ISC

---

## Related Projects
- [Backend Repo](../insuppent-be)

---

## Maintainers
- Abhijit Sarker

---

## Contact
For issues, open a GitHub issue or contact the maintainer.
readme