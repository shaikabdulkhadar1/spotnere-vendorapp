# Prompt: Create Spotnere Vendor Mobile App

## Project Overview

Create a React Native mobile application named **"Spotnere Vendor"** using Expo. This app will be a vendor/partner-facing application for managing places, bookings, and business operations. The app should follow the exact same tech stack, architecture patterns, and code structure as the existing Spotnere mobile app.

---

## 📋 Exact Tech Stack Requirements

### Core Framework & Runtime
- **React Native**: `0.81.5` (exact version)
- **React**: `19.1.0` (exact version)
- **Expo SDK**: `~54.0.32` (exact version)
- **Node.js**: v18 or higher

### Key Dependencies (Exact Versions)
```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "@supabase/supabase-js": "^2.81.1",
  "country-state-city": "^3.1.1",
  "expo": "~54.0.32",
  "expo-blur": "~15.0.8",
  "expo-constants": "~18.0.13",
  "expo-crypto": "~15.0.8",
  "expo-dev-client": "~6.0.20",
  "expo-font": "~14.0.11",
  "expo-image": "~3.0.11",
  "expo-linear-gradient": "~15.0.8",
  "expo-location": "~19.0.8",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-country-state-city": "^1.1.12",
  "react-native": "0.81.5"
}
```

### Dev Dependencies (Exact Versions)
```json
{
  "@babel/core": "^7.25.2",
  "@expo/ngrok": "^4.1.3",
  "babel-preset-expo": "~54.0.10",
  "react-native-dotenv": "^3.4.11"
}
```

---

## 🏗️ Project Structure Requirements

Create the following exact directory structure:

```
spotnere-vendor/
├── App.js                      # Main application entry point
├── index.js                    # Expo entry point
├── app.config.js              # Expo configuration
├── package.json               # Dependencies and scripts
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── eas.json                  # EAS Build configuration
├── .gitignore                # Git ignore rules
│
├── assets/                   # Static assets
│   ├── fonts/                # Custom fonts (Parkinsans family)
│   │   ├── Parkinsans-Light.ttf
│   │   ├── Parkinsans-Regular.ttf
│   │   ├── Parkinsans-Medium.ttf
│   │   ├── Parkinsans-SemiBold.ttf
│   │   ├── Parkinsans-Bold.ttf
│   │   └── Parkinsans-ExtraBold.ttf
│   ├── icons/                # App icons and splash screens
│   │   ├── adaptive-icon.png
│   │   ├── ios-dark.png
│   │   ├── ios-light.png
│   │   ├── ios-tinted.png
│   │   └── splash-icon.png
│   └── icon.png              # Main app icon
│
├── components/               # Reusable UI components
│   ├── BottomNavBar.js      # Bottom navigation bar
│   ├── PlaceCard.js         # Card component (or VendorCard.js)
│   ├── SkeletonCard.js      # Loading skeleton component
│   ├── LoginForm.js         # Login/registration form
│   └── BookingModal.js      # Booking modal component
│
├── screens/                 # Screen components
│   ├── HomeScreen.js        # Dashboard/home screen
│   ├── PlacesScreen.js      # Manage places screen
│   ├── BookingsScreen.js    # Bookings management screen
│   ├── AnalyticsScreen.js    # Analytics screen
│   ├── ProfileScreen.js     # Vendor profile screen
│   ├── PlaceDetailScreen.js # Place details/edit screen
│   ├── LoginScreen.js       # Login/registration screen
│   ├── ManageProfileScreen.js # Profile management
│   ├── PasswordSecurityScreen.js # Password change
│   ├── AboutUsScreen.js     # About us screen
│   └── HelpCenterScreen.js  # Help center screen
│
├── config/                  # Configuration files
│   └── supabase.js         # Supabase client configuration
│
├── constants/               # App constants
│   ├── colors.js           # Color palette definitions
│   └── fonts.js            # Font family definitions
│
├── utils/                   # Utility functions
│   ├── auth.js             # Authentication utilities
│   ├── places.js           # Places management
│   ├── bookings.js         # Bookings management
│   ├── placesCache.js      # Places data caching
│   └── bookingsCache.js    # Bookings data caching
│
└── database/               # Database schemas
    └── vendors_table.sql   # Vendors table schema
```

---

## ⚙️ Configuration Files

### 1. package.json
```json
{
  "name": "spotnere-vendor",
  "license": "0BSD",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "npx expo start",
    "android": "npx expo start --android",
    "ios": "npx expo start --ios",
    "web": "npx expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@supabase/supabase-js": "^2.81.1",
    "country-state-city": "^3.1.1",
    "expo": "~54.0.32",
    "expo-blur": "~15.0.8",
    "expo-constants": "~18.0.13",
    "expo-crypto": "~15.0.8",
    "expo-dev-client": "~6.0.20",
    "expo-font": "~14.0.11",
    "expo-image": "~3.0.11",
    "expo-linear-gradient": "~15.0.8",
    "expo-location": "~19.0.8",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-country-state-city": "^1.1.12",
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@expo/ngrok": "^4.1.3",
    "babel-preset-expo": "~54.0.10",
    "react-native-dotenv": "^3.4.11"
  },
  "private": true
}
```

### 2. babel.config.js
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
```

### 3. metro.config.js
```javascript
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure proper resolution of all file extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'js', 'jsx', 'ts', 'tsx', 'json'];

module.exports = config;
```

### 4. eas.json
```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 5. app.config.js
```javascript
/**
 * Expo App Configuration
 * This file allows us to use environment variables from .env file
 */

require("dotenv").config();

export default {
  expo: {
    name: "Spotnere Vendor",
    owner: "shaikabdulkhadar571",
    slug: "spotnere-vendor",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/icons/splash-icon.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.spotnere.vendor",
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app needs access to your location to manage your places.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app needs access to your location to manage your places.",
      },
      icons: {
        light: "./assets/icons/ios-light.png",
        dark: "./assets/icons/ios-dark.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
    },
    android: {
      package: "com.spotnere.vendor",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey:
        process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY,
      countryStateCityApi: process.env.COUNTRY_STATE_CITY_API,
      eas: {
        projectId: "your-project-id-here",
      },
    },
  },
};
```

### 6. index.js
```javascript
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
```

### 7. .gitignore
```
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

._*

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo

# generated native folders
/ios
/android

# Mac generated files
.DS_Store
._*
*.DS_Store

# Windows generated files
Thumbs.db
ehthumbs.db
Desktop.ini

# Linux generated files
.directory
.DS_Store
.Thumbs.db
```

---

## 🎨 Design System Requirements

### Color Scheme (Use Exact Same Colors)
Use the exact same color palette from `constants/colors.js`:

**Light Mode: "Forest Highlands"**
```javascript
export const colors = {
  primary: "#3E5C54",           // Deep Juniper
  secondary: "#D4A373",           // Warm Sand
  accent: "#E9AD52",              // Muted Gold
  background: "#F8F9F4",          // Bone
  surface: "#E3E9E2",             // Soft Moss
  topsectionbackground: "#EEF2E6",
  cardBackground: "#FFFFFF",
  badgeBackground: "#F4F4F5",
  text: "#24302D",                // Dark Forest Charcoal
  textSecondary: "#5F6D6A",
  border: "#DDE3D9",
  shadow: "rgba(36, 48, 45, 0.1)",
  todayRow: "#BBD3BB",
  success: "#5B8266",
  error: "#A35248",               // Muted Clay Red
  warning: "#D4A373",
  info: "#3E5C54",
};
```

**Dark Mode: "Neutral Stone"**
```javascript
export const darkColors = {
  primary: "#4F6F64",
  secondary: "#9B7B52",
  accent: "#CFA24A",
  background: "#0E0F10",
  surface: "#161819",
  topsectionbackground: "#131516",
  cardBackground: "#1C1F20",
  badgeBackground: "#232627",
  text: "#E7E9EA",
  textSecondary: "#A0A5A8",
  border: "#2A2E30",
  shadow: "rgba(0, 0, 0, 0.8)",
  todayRow: "#2B3A36",
  success: "#6E9C86",
  error: "#C0675D",
  warning: "#CFA24A",
  info: "#7A8F88",
};
```

### Typography (Use Exact Same Fonts)
Use the exact same font family from `constants/fonts.js`:

```javascript
export const fonts = {
  light: "Parkinsans-Light",
  regular: "Parkinsans-Regular",
  medium: "Parkinsans-Medium",
  semiBold: "Parkinsans-SemiBold",
  bold: "Parkinsans-Bold",
  extraBold: "Parkinsans-ExtraBold",
};
```

**Font Loading Pattern:**
```javascript
import { useFonts } from "expo-font";

const [fontsLoaded] = useFonts({
  "Parkinsans-Light": require("./assets/fonts/Parkinsans-Light.ttf"),
  "Parkinsans-Regular": require("./assets/fonts/Parkinsans-Regular.ttf"),
  "Parkinsans-Medium": require("./assets/fonts/Parkinsans-Medium.ttf"),
  "Parkinsans-SemiBold": require("./assets/fonts/Parkinsans-SemiBold.ttf"),
  "Parkinsans-Bold": require("./assets/fonts/Parkinsans-Bold.ttf"),
  "Parkinsans-ExtraBold": require("./assets/fonts/Parkinsans-ExtraBold.ttf"),
});
```

---

## 🏛️ Architecture Patterns

### 1. State Management Pattern
- Use React hooks (`useState`, `useEffect`, `useRef`) for component-level state
- Use AsyncStorage for persistent local storage
- Use Supabase for backend database operations
- Implement in-memory caching for performance optimization

### 2. Component Structure Pattern
```javascript
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";

const ComponentName = ({ prop1, prop2, onAction }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles using colors and fonts constants
  },
});

export default ComponentName;
```

### 3. Error Handling Pattern
- Implement Error Boundary component in App.js
- Use try-catch blocks for async operations
- Show user-friendly error messages
- Log errors for debugging

### 4. Loading States Pattern
- Use skeleton loading components (SkeletonCard)
- Show ActivityIndicator for async operations
- Implement smooth loading transitions

### 5. Navigation Pattern
- Use conditional rendering based on `activeTab` state
- Implement bottom navigation bar with 6 tabs
- Use modal overlays for detail screens
- Pass callbacks for navigation actions

---

## 🔧 Utility Functions Pattern

### Authentication Utility (`utils/auth.js`)
Follow the exact same pattern:
- Password hashing using SHA-256 with salt (10,000 iterations)
- User registration with Supabase
- User login with password verification
- AsyncStorage for local auth state
- User data management functions

**Required Functions:**
- `registerUser(formData)`
- `loginUser(email, password)`
- `logout()`
- `getCurrentUser()`
- `isLoggedIn()`
- `updateUserData(userData)`
- `hashPassword(password)`
- `verifyPassword(password, hash)`

### Caching Pattern
Implement caching utilities similar to:
- `placesCache.js` - Cache places data with 5-minute expiration
- `bookingsCache.js` - Cache bookings data with expiration
- Use AsyncStorage for persistence
- Implement cache invalidation on data updates

---

## 📱 Screen Requirements

### Core Screens to Implement:

1. **HomeScreen** (Dashboard)
   - Vendor dashboard with key metrics
   - Quick actions
   - Recent bookings summary
   - Revenue overview

2. **PlacesScreen** (Manage Places)
   - List of vendor's places
   - Add/Edit/Delete places
   - Place status management
   - Filtering and sorting

3. **BookingsScreen** (Bookings Management)
   - List of bookings
   - Booking status management
   - Filter by date, status
   - Booking details view

4. **AnalyticsScreen** (Analytics)
   - Revenue charts
   - Booking trends
   - Popular places
   - Performance metrics

5. **ProfileScreen** (Vendor Profile)
   - Vendor information
   - Settings access
   - Logout functionality

6. **PlaceDetailScreen** (Place Details/Edit)
   - View/Edit place information
   - Manage place images
   - Set pricing and availability
   - View place analytics

7. **LoginScreen** (Authentication)
   - Vendor login
   - Vendor registration
   - Form validation

8. **ManageProfileScreen** (Profile Management)
   - Edit vendor profile
   - Update business information
   - Change contact details

9. **PasswordSecurityScreen** (Security)
   - Change password
   - Security settings

10. **AboutUsScreen** (Information)
    - App information
    - Vendor resources

11. **HelpCenterScreen** (Support)
    - FAQ
    - Support contact
    - Help articles

---

## 🗄️ Database Schema Requirements

### Vendors Table
```sql
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  owner_first_name VARCHAR(255) NOT NULL,
  owner_last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_address TEXT,
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  postal_code VARCHAR(50),
  business_type VARCHAR(255),
  tax_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
```

### Vendor Places Relationship
- Vendors can have multiple places
- Places table should have `vendor_id` foreign key
- Implement proper relationships

### Bookings Table
```sql
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES places(id),
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_place_id ON bookings(place_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
```

---

## 🎯 Key Features to Implement

### 1. Vendor Authentication
- Vendor registration with business details
- Vendor login
- Secure password hashing
- Session management

### 2. Places Management
- Add new places
- Edit existing places
- Delete places
- Upload place images
- Set pricing and availability
- Manage place categories

### 3. Bookings Management
- View all bookings
- Filter bookings by date, status, place
- Update booking status
- View booking details
- Cancel bookings
- Generate booking reports

### 4. Analytics Dashboard
- Revenue overview
- Booking trends (daily, weekly, monthly)
- Most popular places
- Customer statistics
- Performance metrics

### 5. Profile Management
- Edit vendor profile
- Update business information
- Change password
- Manage business settings

---

## 📐 UI/UX Requirements

### Bottom Navigation Bar
- Implement 6 tabs: Home, Places, Bookings, Analytics, Profile, Settings
- Use exact same BottomNavBar component pattern
- Animated active tab indicator
- Blur effect on iOS
- Same styling and behavior

### Card Components
- Use PlaceCard pattern for displaying places/bookings
- Implement SkeletonCard for loading states
- Consistent spacing and styling
- Smooth animations

### Modal Components
- Use BookingModal pattern for modals
- Blur overlay on iOS
- Smooth animations
- Consistent styling

### Form Components
- Use LoginForm pattern for all forms
- Form validation
- Error display
- Consistent input styling

---

## 🔐 Security Requirements

### Password Security
- Use SHA-256 hashing with salt
- 10,000 iterations for password hashing
- Never store plain text passwords
- Implement password verification securely

### Authentication
- Store auth tokens in AsyncStorage
- Validate user sessions
- Implement logout functionality
- Clear sensitive data on logout

### API Security
- Use Supabase Row Level Security (RLS)
- Validate user permissions
- Secure API endpoints
- Handle errors gracefully

---

## 🚀 Performance Requirements

### Caching Strategy
- Cache places data (5-minute expiration)
- Cache bookings data (5-minute expiration)
- Cache vendor profile data
- Implement cache invalidation
- Use AsyncStorage for persistence

### Optimization
- Implement lazy loading for images
- Use efficient algorithms (top-K selection)
- Optimize list rendering
- Minimize re-renders with React.memo
- Use efficient data fetching

### Loading States
- Show skeleton loaders
- Implement smooth transitions
- Handle loading errors gracefully
- Provide user feedback

---

## 📝 Code Style Requirements

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for components
- Use UPPER_CASE for constants
- Use descriptive names

### File Organization
- One component per file
- Group related utilities
- Separate constants
- Organize screens by feature

### Comments
- Add JSDoc comments for functions
- Explain complex logic
- Document component props
- Add inline comments where needed

### Error Handling
- Use try-catch for async operations
- Show user-friendly error messages
- Log errors for debugging
- Handle edge cases

---

## 🧪 Testing Requirements

### Test Coverage
- Test authentication flows
- Test CRUD operations
- Test form validation
- Test error handling
- Test navigation flows

### Device Testing
- Test on iOS devices/simulators
- Test on Android devices/emulators
- Test on different screen sizes
- Test offline functionality

---

## 📦 Environment Variables

### Required Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
COUNTRY_STATE_CITY_API=your_api_key
```

### Configuration Pattern
Use the exact same pattern from `config/supabase.js`:
- Priority: Constants.expoConfig.extra > process.env.EXPO_PUBLIC_* > process.env.*
- Validate credentials on initialization
- Provide helpful error messages

---

## 🎨 Asset Requirements

### Fonts
- Include all Parkinsans font files (Light, Regular, Medium, SemiBold, Bold, ExtraBold)
- Load fonts using expo-font
- Use fonts from constants/fonts.js

### Icons
- Create app icons for iOS and Android
- Create splash screen icon
- Use @expo/vector-icons (Ionicons) for UI icons

### Images
- Create category images if needed
- Optimize images for mobile
- Use expo-image for image loading

---

## 📱 Platform-Specific Requirements

### iOS
- Bundle Identifier: `com.spotnere.vendor`
- Support iPad (supportsTablet: true)
- Location permissions in Info.plist
- App icons for light/dark/tinted modes

### Android
- Package: `com.spotnere.vendor`
- Adaptive icon
- Location permissions in AndroidManifest.xml
- Proper app icon sizes

---

## 🔄 Integration Requirements

### Supabase Integration
- Use same Supabase client pattern
- Implement proper error handling
- Use RLS policies for security
- Handle network errors gracefully

### Location Services
- Request location permissions
- Use expo-location for geocoding
- Handle permission denials gracefully
- Cache location data

---

## 📚 Documentation Requirements

### Code Documentation
- Add JSDoc comments to all functions
- Document component props
- Explain complex logic
- Add README.md with setup instructions

### User Documentation
- Create help center content
- Document features
- Provide user guides
- Add FAQ section

---

## ✅ Checklist

Before considering the app complete, ensure:

- [ ] All dependencies match exact versions
- [ ] Project structure matches requirements
- [ ] All configuration files are correct
- [ ] Color scheme matches exactly
- [ ] Fonts are loaded correctly
- [ ] Navigation works properly
- [ ] Authentication is implemented
- [ ] Database schema is created
- [ ] CRUD operations work
- [ ] Caching is implemented
- [ ] Error handling is comprehensive
- [ ] Loading states are shown
- [ ] Forms are validated
- [ ] Security is implemented
- [ ] Performance is optimized
- [ ] Code follows patterns
- [ ] Documentation is complete
- [ ] App builds successfully
- [ ] App runs on iOS and Android

---

## 🎯 Final Notes

1. **Exact Tech Stack**: Use the exact same versions of all dependencies. Do not upgrade or downgrade any packages.

2. **Code Patterns**: Follow the exact same code patterns, structure, and conventions used in the Spotnere mobile app.

3. **Design System**: Use the exact same color scheme, fonts, and UI components.

4. **Architecture**: Follow the same architecture patterns, state management, and data flow.

5. **Best Practices**: Implement the same error handling, caching, security, and performance optimizations.

6. **Consistency**: Maintain consistency with the existing Spotnere app while adapting for vendor-specific features.

7. **Testing**: Test thoroughly on both iOS and Android platforms before deployment.

---

**This prompt should be used to create a fully functional Spotnere Vendor mobile app that matches the tech stack, architecture, and code quality of the existing Spotnere mobile app.**
