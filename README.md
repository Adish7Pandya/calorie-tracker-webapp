# 🍎 CaloriTrack - AI-Powered Calorie Tracking App

<div align="center">

![CaloriTrack Logo](https://img.shields.io/badge/CaloriTrack-AI%20Powered-brightgreen?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://your-app-url.lovable.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

**Track your calories effortlessly with AI-powered meal suggestions**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [API](#-nutrition-api)

</div>

---

## 📸 Screenshots



### Landing Page
*Beautiful, modern landing page with gradient design and clear call-to-action*

### Dashboard
*Comprehensive dashboard showing daily calories, remaining budget, and meal count*

### 7-Day Trend Chart
*Interactive line chart displaying your calorie consumption over the past week*

### Add Meal Dialog
*Smart nutrition search powered by USDA FoodData Central*

### AI Meal Suggestions
*Get personalized meal recommendations based on your remaining calories*

---

## ✨ Features

### 🎯 Core Functionality
- **Calorie Tracking**: Log meals with detailed nutrition information (calories, protein, carbs, fat)
- **Daily Goal Management**: Set and track your daily calorie goals
- **Visual Analytics**: Beautiful 7-day trend chart to visualize your progress
- **Real-time Updates**: See your progress update instantly as you add meals

### 🤖 AI-Powered Features
- **Smart Meal Suggestions**: Get AI-generated meal recommendations based on:
  - Your remaining calorie budget
  - Your recent meal history
  - Nutritional balance
- **Powered by Gemini 2.5 Flash**: Fast, accurate, and contextual suggestions

### 🔐 User Management
- **Secure Authentication**: Email-based authentication with auto-confirm
- **Personal Profiles**: Each user has their own profile and meal history
- **Data Privacy**: Row-level security ensures your data stays private

### 🎨 Modern UI/UX
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dark Mode Ready**: Seamless dark/light theme support
- **Smooth Animations**: Polished transitions and interactions
- **Accessible**: Built with accessibility in mind

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Query** - Server state management

### Backend (Lovable Cloud)
- **Supabase** - Backend 
  - Spring Boot (JAVA)
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Edge Functions (Serverless)
  - Authentication

### AI & APIs
- **AI Gateway** - Access to Gemini 2.5 Flash
- **USDA FoodData Central API** - Comprehensive nutrition database (100,000+ foods)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd calorie-tracker-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173`


---

## 📱 Usage

### Creating an Account
1. Click "Get Started Free" on the landing page
2. Fill in your email and password
3. Set your daily calorie goal

### Tracking Meals
1. Click "Add Meal" on the dashboard
2. Search for a food item (e.g., "chicken breast")
3. Adjust quantity if needed
4. Click "Add Meal"

### Getting AI Suggestions
1. Click "AI Meal Suggestions" on the dashboard
2. Review personalized recommendations
3. Add suggested meals directly to your log

### Viewing Progress
- Check the **7-Day Trend** chart for your weekly overview
- Monitor **Today's Calories** vs your daily goal
- See **Remaining** calories at a glance

---

## 🏗 Project Structure

```
calorie-tracker-webapp/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AddMealDialog.js
│   │   ├── AISuggestionsDialog.js
│   │   ├── CalorieChart.js
│   │   └── MealList.js
│   ├── pages/              # Page components
│   │   ├── Auth.jtw       # Authentication page
│   │   ├── Dashboard.js   # Main dashboard
│   │   └── Index.js       # Landing page
│   ├── integrations/       # Supabase integration
│   │   └── supabase/
│   ├── App.java           # Main app component
│   └── main.java            # Entry point
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── ai-suggest-meals/
│   │   └── search-nutrition/
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase configuration
├── java-backend/           # Optional Java 21 backend
└── public/                 # Static assets
```

---

## 🌟 Key Components

### CalorieChart
Interactive line chart showing 7-day calorie trends with dummy data for demonstration.

### AddMealDialog
Smart dialog with nutrition search integration. Searches USDA database and displays results with serving sizes.

### AISuggestionsDialog
AI-powered meal recommendations using Gemini 2.5 Flash, considering remaining calories and recent meals.

### Dashboard
Main application interface with stats cards, progress tracking, and quick actions.

---

## 🔐 Security

- **Row Level Security (RLS)**: All database tables have RLS policies ensuring users can only access their own data
- **Authentication**: Secure email/password authentication with Supabase
- **Environment Variables**: Sensitive data stored in environment variables
- **API Keys**: Edge functions handle API keys server-side


---


### Future Enhancements
- [ ] Barcode scanning for packaged foods
- [ ] Meal templates and favorites
- [ ] Weekly/monthly reports
- [ ] Export data to CSV
- [ ] Macro tracking goals
- [ ] Weight tracking integration
- [ ] Social features (share meals, challenges)
- [ ] Mobile app (React Native)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

