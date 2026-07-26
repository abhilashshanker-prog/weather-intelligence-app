# Weather Intelligence App (Cloudflare Pages Deployment Ready)

An AI-native **Weather Intelligence Web Application** built in Google AI Studio App Build, utilizing public Open-Meteo Geocoding and Forecast APIs to deliver real-time weather metrics, 24-hour trend charts, 7-day meteorological forecasts, and automated activity recommendations.

This repository is pre-configured for direct deployment from GitHub to **Cloudflare Pages**.

---

## 🚀 API Architecture & Endpoints

This application connects exclusively to the public Open-Meteo REST APIs (no API key required):

| API Endpoint | URL / Pattern | Purpose |
| :--- | :--- | :--- |
| **Open-Meteo Geocoding API** | `https://geocoding-api.open-meteo.com/v1/search` | Converts city names into geographic latitude and longitude coordinates. |
| **Open-Meteo Forecast API** | `https://api.open-meteo.com/v1/forecast` | Fetches current weather, 24-hour telemetry, and 7-day forecast data. |

---

## ✨ Features & Intelligence Capabilities

- **City Search with Autocomplete**: Search any global city with instant debounced geocoding suggestions.
- **Popular City Presets**: One-click quick weather checks for London, New York, Tokyo, Paris, Sydney, and Mumbai.
- **Real-Time Weather Metrics**: Temperature, feels-like index, humidity, dew point, UV index, wind speed/direction, peak gusts, cloud cover, visibility, and atmospheric pressure.
- **Smart Activity Feasibility**: Automated scoring (0-100%) and recommendations for Outdoor Running, Cycling, Outdoor Dining, Beach/Swimming, and Stargazing.
- **Actionable Advisories**: Dynamic clothing guidance, rain gear warnings, high UV health warnings, and gale-force wind alerts.
- **Interactive 24-Hour Charts**: Built with `recharts` to visualize temperature curves, precipitation probabilities, and wind speeds over the next 24 hours.
- **7-Day Outlook**: Daily high/low temperature bar visualizers, sunrise/sunset arcs, and expandable daily telemetry drawers.
- **Robust Error Handling**: Clean fallback states for invalid city queries, network timeouts, or geolocation denial.
- **Unit Conversions**: Switch between °C / °F and km/h / mph.

---

## 🛠️ Local Development & Build Commands

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```
This compiles the single-page application into static assets inside the `dist/` folder.

---

## 🌐 Deploying to Cloudflare Pages via GitHub

Follow these steps to deploy this repository directly to Cloudflare Pages:

### Step 1: Export / Connect Google AI Studio to GitHub
1. In Google AI Studio App Build, click **Export / Connect to GitHub** in the top navigation or settings menu.
2. Select or create a GitHub repository to store the source code.

### Step 2: Connect Repository in Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** &rarr; **Create Application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Authorize GitHub access and select your connected Weather Intelligence repository.

### Step 3: Configure Cloudflare Build Settings
Set the build configuration as follows:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | `Vite` (or `None`) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave empty or default) |
| **Node.js Version** | `18` or `20` (default) |

### Step 4: Save & Deploy
1. Click **Save and Deploy**.
2. Cloudflare Pages will execute `npm run build` and publish your live application to a `*.pages.dev` domain (e.g., `weather-intelligence.pages.dev`).

---

## 🧪 Test Cases & Verification Checklist

To validate application behavior before submission:

| Test Case | Steps | Expected Result |
| :--- | :--- | :--- |
| **Valid City Test 1** | Search for **"London"** or select London preset pill. | Weather loads immediately; shows current temp, 24-hour chart, 7-day outlook, and smart advisories. |
| **Valid City Test 2** | Search for **"Tokyo"** or select Tokyo preset pill. | Geocoding resolves Japan coordinates; updates metrics and activity feasibility scores seamlessly. |
| **Invalid City Error Test** | Type **"XyZ123NonExistentCity"** in the search bar. | App displays "City Not Found" error banner with guidance to check spelling or try a major city name. |
| **Unit Toggle Test** | Click **°C / °F** or **km/h / mph** in the top bar. | All temperatures and wind speeds update across the hero card, charts, and 7-day outlook. |

---

## 📄 Deliverables & Evidence Submission

1. **Live Cloudflare Pages URL**: `https://<your-project>.pages.dev`
2. **GitHub Repository Link**: Containing source files, `package.json`, `dist/` configuration, and this `README.md`.
3. **Rubric Sheet**: Completed `AI-Assisted App Building Evaluation Rubric - L2` sheet.
4. **ZIP Archive**: Named following the convention `empid_emp_name_appbuilding_L2.zip`.
