# Kids Gaming Fun - Participant Admin

A modern Angular 16 web application for managing participants (trainees) with CRUD operations, search, sorting, pagination, and dashboard analytics. Built with the playful "Kids Gaming Fun" brand theme.

## Features

- 🎮 **Kids Gaming Fun Theme** - Playful Comic Sans MS fonts and vibrant green/yellow color scheme
- 👥 **Participant Management** - Full CRUD operations for participant data
- 🔍 **Search & Filter** - Real-time search by name, email, or GitHub ID
- 📊 **Dashboard Analytics** - KPI cards and interactive charts showing skill distributions
- 📱 **Responsive Design** - Mobile-friendly interface using Angular Material
- 🔐 **API Integration** - Secure communication with Laravel backend using API key authentication

## Technology Stack

- **Frontend**: Angular 16, TypeScript, Angular Material
- **Charts**: Chart.js with ng2-charts
- **Styling**: SCSS with Comic Sans MS font family
- **State Management**: Reactive Forms and RxJS
- **HTTP Client**: Angular HttpClient with interceptors

## API Configuration

### Setting up the API Connection

1. **Open the environment file**: `src/environments/environment.ts`
2. **Update the API configuration**:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'https://api.hereandnowai.com/public/api',
     apiKeyHeaderName: 'X-API-KEY',
     apiKeyValue: 'YOUR_ACTUAL_API_KEY_HERE'  // Replace with your real API key
   };
   ```

3. **For production**, update `src/environments/environment.prod.ts` with the same values.

### API Endpoints

The application connects to a Laravel 8 API with these endpoints:

- `GET /participants` - List all participants
- `GET /participants/{id}` - Get single participant
- `POST /participants` - Create new participant
- `PUT /participants/{id}` - Update participant
- `DELETE /participants/{id}` - Delete participant

### Authentication

API requests are authenticated using a header-based API key:
- Header Name: `X-API-KEY` (configurable in environment)
- All requests include `Content-Type: application/json` and `Accept: application/json`

## Installation & Setup

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher
- Angular CLI 16

### Installation Steps

1. **Clone or download the project**
2. **Navigate to the project directory**:
   ```bash
   cd participant-admin
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure API settings** (see API Configuration section above)

5. **Start the development server**:
   ```bash
   ng serve
   ```

6. **Open your browser** and navigate to `http://localhost:4200`

## Application Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Dashboard with KPIs and charts
│   │   ├── participant-form/    # Create/Edit participant form
│   │   ├── participants-list/   # List view with search and actions
│   │   └── layout/shell/        # Main layout component
│   ├── models/                  # TypeScript interfaces
│   ├── services/               # HTTP services and business logic
│   ├── interceptors/           # HTTP interceptors for API key
│   ├── material.module.ts      # Angular Material imports
│   └── app-routing.module.ts   # Application routes
├── environments/               # Environment configuration
└── styles.scss                # Global styles with branding
```

## Available Routes

- `/participants` - List all participants (default route)
- `/participants/new` - Create new participant
- `/participants/:id` - Edit existing participant
- `/dashboard` - Analytics dashboard
- `**` - Redirects to participants list

## Data Model

Participants have the following fields:

```typescript
interface Participant {
  id?: number;
  name: string;                    // Required
  email?: string;                  // Optional, email format
  whatsapp?: string;              // Optional, phone number
  linkedin?: string;              // Optional, URL format
  github_id?: string;             // Optional
  python_skill?: number;          // Optional, 1-10 scale
  angular_skill?: number;         // Optional, 1-10 scale
  javascript_skill?: number;      // Optional, 1-10 scale
  html_skill?: number;           // Optional, 1-10 scale
  css_skill?: number;            // Optional, 1-10 scale
  java_skill?: number;           // Optional, 1-10 scale
  outcome?: string;              // Optional, text area
  created_at?: string;           // Server-managed
  updated_at?: string;           // Server-managed
}
```

## Development

### Building for Production

```bash
ng build --prod
```

### Running Tests

```bash
ng test
```

### Code Quality

The application follows Angular best practices:
- Reactive forms with validation
- HTTP error handling with user-friendly messages
- Responsive design principles
- Component-based architecture
- TypeScript strict mode

## Upgrading to Server-Side Pagination

The current implementation uses client-side pagination for simplicity. To upgrade to server-side pagination:

1. **Update the service** (`participants.service.ts`):
   ```typescript
   list(page: number = 1, limit: number = 10, search?: string): Observable<PaginatedResponse<Participant[]>> {
     const params = new HttpParams()
       .set('page', page.toString())
       .set('limit', limit.toString())
       .set('search', search || '');
     
     return this.http.get<PaginatedResponse<Participant[]>>(this.apiUrl, { params });
   }
   ```

2. **Update the component** to handle paginated responses
3. **Modify the template** to use server-side pagination controls

## Branding Theme

The application uses the "Kids Gaming Fun" branding:

- **Primary Color**: #4CAF50 (Green)
- **Secondary Color**: #FFC107 (Yellow/Gold)
- **Font Family**: Comic Sans MS, Comic Sans, cursive
- **Tagline**: "Play, Learn, and Grow!"

## Support

For technical support or questions about the API, please refer to the backend API documentation or contact the development team.

## License

This project is developed for internal use by Kids Gaming Fun.
