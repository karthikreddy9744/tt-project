# Study Group & Peer Learning Platform - Frontend

A production-level frontend for a collaborative study platform built with React, Vite, Tailwind CSS, and modern UI/UX principles.

## 🚀 Features

### Core Functionality
- **Dashboard**: Activity heatmap, recent files, active discussions, upcoming sessions, smart suggestions
- **Study Groups**: Card-based layout with hover animations, member counts, activity indicators
- **Files**: Drag-and-drop upload, file preview cards, upvote/downvote system, tag-based filtering
- **Discussions**: Threaded replies UI, upvote system, solved badges, expandable replies
- **Sessions**: Timeline view with countdown timer, join buttons with animations, live session indicators

### UI/UX Features
- **Glassmorphism Design**: Modern glass-morphism effects with backdrop blur
- **Dark Mode**: Default dark theme with light mode support
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Skeleton Loaders**: Loading states for all data components
- **Toast Notifications**: React Hot Toast for user feedback

### Technical Features
- **State Management**: Zustand for global state management
- **API Integration**: Axios with interceptors for authentication and error handling
- **Routing**: React Router for navigation
- **Component Architecture**: Reusable UI components with consistent design system
- **Type Safety**: TypeScript support throughout the application

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 8
- **Styling**: Tailwind CSS 4, custom design system
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **State Management**: Zustand 5
- **HTTP Client**: Axios 1
- **Notifications**: React Hot Toast 2
- **Routing**: React Router DOM 7
- **UI Components**: Headless UI, custom component library

## 🎨 Design System

### Color Palette
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #22C55E (Green)
- **Accent**: #F59E0B (Amber)
- **Background Dark**: #0F172A (Slate)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive sizing**: 16px base with mobile adjustments

### Components
- **Buttons**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Cards**: Glass-morphism effects with hover states
- **Inputs**: Consistent styling with error states
- **Skeletons**: Loading placeholders for various content types

## 📦 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components (Sidebar, Navbar)
│   └── dashboard/       # Dashboard-specific components
├── pages/               # Page components
├── lib/
│   ├── store.js         # Zustand store
│   ├── api.js           # API configuration
│   └── utils.js         # Utility functions
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm start` - Alias for `npm run dev`

## 🌐 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

The project is pre-configured with `vercel.json` for optimal deployment.

### Environment Variables for Production

Set these in your Vercel dashboard:
- `VITE_API_URL` - Your backend API URL

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Configuration

### Tailwind CSS

Custom configuration in `tailwind.config.js`:
- Extended color palette
- Custom animations
- Glass-morphism utilities
- Responsive breakpoints

### API Configuration

API endpoints configured in `src/lib/api.js`:
- Base URL from environment variables
- Request/response interceptors
- Error handling
- Authentication headers

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic with React Router
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Built-in Vite bundle analyzer
- **Caching**: Proper cache headers for static assets

## 🧪 Testing

The project is structured to support testing:
- Component testing with React Testing Library
- E2E testing with Playwright (recommended)
- API testing with mocked responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

Built with ❤️ for collaborative learning
