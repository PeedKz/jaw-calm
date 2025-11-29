# JawRelax - Bruxism Habit Tracker

A beautiful, calming mobile-first PWA that helps users with bruxism develop healthier jaw habits through smart reminders, micro-exercises, and gamification.

## 🎯 Features

### ✨ Onboarding
- Multi-step guided onboarding flow
- Collects bruxism type (daytime/nighttime/both)
- Sets daily relaxation goals
- Assesses stress and bruxism intensity levels

### 📊 Dashboard
- Today's progress tracking with circular progress ring
- Current streak counter
- Level and XP display
- Quick relaxation logging
- Quick access to exercises

### 💪 Exercises Library
- 5 guided micro-exercises for jaw relaxation
- Step-by-step instructions
- Timed exercise sessions
- Interactive exercise flow with animations

### 📈 Progress Tracking
- Weekly activity chart
- Monthly activity heatmap
- Total relaxations counter
- Longest streak tracking
- Current level display

### 🏆 Gamification
- XP system (10 XP per relaxation)
- Level progression (100 XP per level)
- Daily streaks
- 6 unique badges to unlock:
  - First Step (1 relaxation)
  - Week Warrior (7-day streak)
  - Zen Master (Level 10)
  - Century Club (100 relaxations)
  - Month Champion (30-day streak)
  - Jaw Master (500 relaxations)

### ⚙️ Settings
- Language toggle (English/Português)
- Reminder frequency customization (30-240 min)
- Sound & vibration toggles
- Silent mode option

## 🎨 Design System

### Color Palette
- **Primary**: Calming teal (#0EA5E9 range)
- **Secondary**: Soft lavender
- **Accent**: Gentle purple
- **Success**: Soft green
- **Background**: Very light blue/white

### Typography
- **Headings**: Quicksand (warm, friendly)
- **Body**: Inter (clean, readable)

### Animations
- Smooth transitions using Framer Motion
- Gentle bounce effects
- Fade-in/scale-in animations
- Progress ring animations
- Step indicator animations

## 📱 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: React Context
- **Storage**: LocalStorage
- **Routing**: React Router v6

## 🗂️ Project Structure

```
src/
├── assets/               # Images and static assets
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── BadgeCard.tsx    # Badge display component
│   ├── BottomNav.tsx    # Bottom navigation bar
│   ├── ExerciseCard.tsx # Exercise list item
│   └── ProgressRing.tsx # Circular progress indicator
├── contexts/
│   └── AppContext.tsx   # Global app state management
├── lib/
│   ├── exercises.ts     # Exercise data and utilities
│   ├── gamification.ts  # XP, levels, and badges logic
│   ├── storage.ts       # LocalStorage abstraction
│   ├── translations.ts  # i18n strings (EN/PT)
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Progress.tsx     # Progress tracking view
│   ├── Rewards.tsx      # Badges and achievements
│   ├── Exercises.tsx    # Exercise library
│   ├── ExerciseDetail.tsx # Individual exercise view
│   ├── Settings.tsx     # App settings
│   ├── Onboarding.tsx   # First-time user flow
│   └── NotFound.tsx     # 404 page
├── types/
│   └── index.ts         # TypeScript interfaces
├── App.tsx              # App router and providers
├── main.tsx            # App entry point
└── index.css           # Design system & global styles
```

## 💾 Data Models

### UserProfile
- Bruxism type, daily goal, stress level, intensity
- Language preference
- Creation date

### UserProgress
- Total XP, level, streaks
- Total relaxations
- Last activity timestamp

### HabitEntry
- Timestamp, type (reminder/manual)
- XP earned

### Badge
- Name (bilingual), description, icon
- Unlock status and date
- Requirements and type

### Exercise
- Title, description (bilingual)
- Steps, duration, difficulty
- Icon representation

### Reminder
- Frequency, sound, vibration settings
- Custom messages
- Silent mode flag

## 🌐 Internationalization

Full support for:
- **English** (en)
- **Português** (pt)

All UI strings, exercises, and badges are fully translated.

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 📝 Usage Notes

- App uses localStorage for data persistence
- No backend required - fully client-side
- Mobile-first responsive design
- Works offline after first load
- Can be installed as PWA

## 🔮 Future Enhancements

- Push notifications for reminders
- Data export/import
- Social features (share progress)
- More exercises and challenges
- Dark mode toggle
- Custom reminder messages
- Integration with health tracking apps
- Weekly challenges system
- Meditation timer integration

## 📄 License

Built with Lovable ❤️
