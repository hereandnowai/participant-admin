# Participant Admin - Angular Application

**HERE AND NOW AI** - Participant Management System

A comprehensive Angular application for managing participants with full CRUD operations, analytics dashboard, and Laravel API integration. Built following modern Angular best practices with Material Design components and signals-based state management.

## 🚀 Features

### Core Functionality
- **Participant Management**: Complete CRUD operations for participant data
- **Search & Filter**: Real-time search with skill-based filtering
- **Analytics Dashboard**: Interactive charts and KPI metrics
- **Responsive Design**: Mobile-first approach with Material Design
- **Real-time Notifications**: User feedback with Material Snackbar
- **Laravel API Integration**: Full backend connectivity with authentication

### Technical Features
- **Angular 20.2.1**: Latest version with modern features
- **Signals State Management**: Reactive state management
- **Material Design**: Complete UI component library
- **TypeScript**: Strict type safety throughout
- **SCSS**: Advanced styling with custom themes
- **HTTP Interceptors**: API key authentication
- **Lazy Loading**: Optimized module loading
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 18+ 
- **npm**: Version 9+
- **Angular CLI**: Version 20+
- **Laravel Backend**: Running participant API server

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd participant-admin

# Install dependencies
npm install
```

### 2. Environment Configuration

Update the environment files with your Laravel API settings:

**src/environments/environment.ts**
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api',
  apiKey: 'your-api-key-here'
};
```

**src/environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-production-api.com/api',
  apiKey: 'your-production-api-key'
};
```

### 3. Laravel API Setup

Ensure your Laravel backend has these endpoints:

```
GET    /api/participants           # List all participants
POST   /api/participants           # Create new participant
GET    /api/participants/{id}      # Get participant by ID
PUT    /api/participants/{id}      # Update participant
DELETE /api/participants/{id}      # Delete participant
GET    /api/participants/stats     # Get analytics statistics
```

## 🚦 Running the Application

### Development server

To start a local development server, run:

```bash
ng serve
```
Navigate to `http://localhost:4200`

### Production Build
```bash
npm run build
# or
ng build --configuration production
```

### Testing
```bash
# Unit tests
npm test

# End-to-end tests
npm run e2e

# Linting
npm run lint
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Analytics dashboard
│   │   └── participants/       # Participant management
│   │       ├── participants-list/
│   │       ├── participant-form/
│   │       └── confirm-dialog/
│   ├── models/                 # TypeScript interfaces
│   │   └── participant.model.ts
│   ├── services/               # Angular services
│   │   ├── participants.service.ts
│   │   └── notification.service.ts
│   ├── shared/                 # Shared modules
│   │   └── material.module.ts
│   ├── interceptors/           # HTTP interceptors
│   │   └── api-key.interceptor.ts
│   ├── app.routes.ts          # Application routing
│   ├── app.component.ts       # Root component
│   └── app.module.ts          # Root module
├── environments/              # Environment configurations
├── styles.scss               # Global styles and Material theme
└── assets/                  # Static assets
```

## 🔧 Configuration

### API Integration

The application uses HTTP interceptors for API communication:

```typescript
// All requests automatically include:
headers: {
  'X-API-Key': environment.apiKey,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### State Management

Using Angular Signals for reactive state:

```typescript
// Participant service signals
participants = signal<Participant[]>([]);
loading = signal<boolean>(false);
error = signal<string | null>(null);
```

### Material Theme

Custom HERE AND NOW AI branding with Material Design:

- **Primary Color**: #3f51b5 (Indigo)
- **Accent Color**: #e91e63 (Pink)
- **Warning Color**: #f44336 (Red)

## 📱 Components Overview

### Dashboard Component
- **Purpose**: Analytics and overview
- **Features**: KPI cards, participant statistics, skill distribution
- **Location**: `src/app/components/dashboard/`

### Participants List Component
- **Purpose**: Display and manage participant list
- **Features**: Search, filter, pagination, sorting
- **Location**: `src/app/components/participants/participants-list/`

### Participant Form Component
- **Purpose**: Create and edit participants
- **Features**: Reactive forms, validation, skill selection
- **Location**: `src/app/components/participants/participant-form/`

### Navigation Shell
- **Purpose**: Application layout and navigation
- **Features**: Responsive toolbar, brand section, routing
- **Location**: `src/app/app.component.ts`

## 🎨 Styling

### Global Theme
- Material Design components with custom HERE AND NOW AI branding
- Responsive design patterns
- CSS custom properties for consistent theming
- SCSS mixins and variables

### Component Styles
- Component-specific SCSS files
- Material Design principles
- Mobile-first responsive design
- Accessibility considerations

## 🔒 Security

### API Authentication
- HTTP interceptor for API key authentication
- Environment-based configuration
- Error handling for unauthorized requests

### Input Validation
- Reactive form validation
- TypeScript strict mode
- Sanitized user inputs

## 🧪 Testing Strategy

### Unit Testing
- Component testing with Angular Testing Utilities
- Service testing with HTTP mocking
- Signal testing for state management

### Integration Testing
- Component interaction testing
- API integration testing
- Navigation flow testing

## 📈 Performance

### Optimization Features
- Lazy loading modules
- OnPush change detection
- Signals for efficient state updates
- Optimized bundle sizes

### Best Practices
- Tree shaking enabled
- Proper TypeScript configuration
- Minimal dependency usage
- Efficient component design

## 🚀 Deployment

### Build Process
```bash
# Production build with optimization
ng build --configuration production

# Build output location
dist/participant-admin/
```

### Environment Variables
- Configure API endpoints for production
- Set appropriate API keys
- Update branding assets if needed

## 🤝 Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Implement proper error handling
4. Add unit tests for new features
5. Follow Material Design principles

## 📄 License

This project is part of the HERE AND NOW AI ecosystem.

## 🆘 Support

For support and questions:
- **Email**: support@hereandnowai.com
- **Website**: https://hereandnowai.com
- **Documentation**: Internal wiki and API docs

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **Angular 20.2.1**: Latest Angular version implementation
- **Material Design**: Full Material UI integration
- **Signals**: Modern state management

---

**Built with ❤️ by HERE AND NOW AI**
