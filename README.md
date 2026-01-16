# SupplyChainX Frontend

A modern, enterprise-grade Angular 19 frontend for supply chain management with Keycloak authentication and real-time dashboard analytics.

## Features

- **Enterprise Dashboard** - Real-time KPI cards, charts, and AI-powered insights
- **Authentication** - Keycloak SSO with role-based access control
- **CRUD Modules** - Users, Suppliers, Products, Orders, Deliveries, and more
- **Modern UI/UX** - Premium dark theme with glassmorphism effects

## Tech Stack

- **Framework**: Angular 19.2
- **UI Library**: PrimeNG 19
- **Styling**: Tailwind CSS + Custom SCSS
- **Auth**: Keycloak Angular
- **Charts**: Chart.js

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build
```

Open `http://localhost:4200` in your browser.

## Project Structure

```
src/app/
├── components/          # Feature components
│   ├── dashboard/       # Main dashboard with widgets
│   ├── home/            # Landing page
│   ├── login/           # Authentication
│   └── [entity]-list/   # CRUD list views
│   └── [entity]-form/   # CRUD form views
├── guards/              # Route guards (auth, role)
├── interceptors/        # HTTP interceptors
├── models/              # TypeScript interfaces
└── services/            # API services
```

## Authentication

Keycloak configuration in `src/environments/environment.ts`:

```typescript
keycloak: {
  url: 'http://localhost:8443',
  realm: 'Supplychainx',
  clientId: 'supplychainx-frontend'
}
```

### Roles

| Role | Access |
|------|--------|
| ADMIN | Full access to all modules |
| GESTIONNAIRE_STOCK | Procurement, production, raw materials |
| RESPONSABLE_PRODUCTION | Production orders, products, BOM |
| RESPONSABLE_LIVRAISON | Deliveries and logistics |

## API Integration

Backend API: `http://localhost:8083/api`

All requests include JWT token via auth interceptor.

## Development

```bash
# Generate component
ng generate component components/feature-name

# Run tests
ng test

# Lint
ng lint
```

## License

MIT
