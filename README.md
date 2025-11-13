# Vehicle Value Predictor

A web application that predicts vehicle values and generates depreciation forecasts based on VIN lookup and vehicle condition data using a machine learning model trained on a Random Forest algorithm. The model was trained using a Kaggle dataset consisting of 3 million used vehicle records.

## What the application does:

Enter a vehicle's VIN number, confirm the vehicle details, answer a few questions about the vehicle, and get an instant prediction of its current and future value over a 5-year timeline. Built with a React frontend and Flask backend.

---

## Prerequisites

- **Python 3.8+** (check with `python --version`)
- **Node.js 18+** (check with `node --version`)
- **15GB free disk space** (for model and dataset downloads)

---

## Installation & Setup

### Step 1: Extract the Project

Unzip the project files to your preferred location.

### Step 2: Open in Your IDE

Open the extracted folder in VS Code (recommended), or your IDE of choice.

### Step 3: Open Two Terminals

You'll need one for the backend and one for the frontend.

---

### Step 4: Backend Setup

**Terminal 1 - Backend:**

1. Navigate to the backend directory using command:
```bash
   cd backend
```

2. **(Optional)** Create a virtual environment to avoid package conflicts, run these commands as shown:
```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # You should see (venv) in your prompt
```

3. Run the setup script (this will take a couple of minutes):
```bash
   python setup.py
```
   This installs dependencies and downloads the model (~3GB). Expect 10-15 minutes.

4. Wait for the setup to complete.

5. Verify the setup completed successfully.

---

### Step 5: Frontend Setup

**Terminal 2 - Frontend:**

1. Navigate to the frontend directory running command:
```bash
   cd frontend
```

2. Install dependencies running command:
```bash
   npm install
```
   This takes about 60 seconds.

---

## Running the Application

### Step 6: Start the Frontend

In **Terminal 2** (frontend directory) run:
```bash
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

Leave the terminal running.

---

### Step 7: Start the Backend

In **Terminal 1** (backend directory) run command:
```bash
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

Leave this terminal running as well.

---

### Step 8: Access the App

Open your browser and go to **http://localhost:5173**

or use the provided link above in the frontend terminal
```
Local:   http://localhost:5173/
```

The Vehicle Value Predictor should now load.

---

## How to Use It

### Step 9: Enter a VIN

On the home page, enter a vehicle VIN number. Feel free to use any valid VIN or use one provided in the documentation. The app will look up the vehicle details.

Click **"Get my vehicle value prediction"**.

### Step 10: Confirm vehicle details

The app will show you the vehicle info pulled from the NHTSA database from the entered VIN. If it matches the provided information from the documentation or matched details from a different VIN: 

click **"Continue to Questionnaire"**

### Step 12: Fill Vehicle Questionnaire

Fill out the vehicle questionnaire:
- mileage
- zip code
- exterior color
- interior color

(If using a provided VIN, the details above will be in the documentation.)

For the details below, leave at default values or feel free to change to see how the model adjusts prices.

- First Owner
- Frame Damage
- Previous Accidents
- Salvage Title
- Theft Title

click **"Calculate my vehicle value"** to generate prediction.

### Step 14: View Results

Review the results:
- **Current and future value**
- **Expected depreciation**
- **Interactive vehicle value timeline** (5-year forecast)
- **Average annual mileage and yearly depreciation**

### Step 15: Test Another Vehicle

Want to try another VIN? Just go back to the home page by clicking the "Generate New Prediction" button and repeat the process.

---

## Stopping the Application

When you're done:

1. Press **Ctrl+C** in the frontend terminal
2. Press **Ctrl+C** in the backend terminal
3. (Optional) If you used a virtual environment: `deactivate`

---

## Troubleshooting

**"python: command not found"**  
Try `python3` instead of `python`.

**Port 5000 already in use**  
If another app is using that port, close the conflicting application. The application frontend and backend both expect the use of Port 5000.

**Module not found errors**  
Make sure you ran `python setup.py` successfully before trying to start the app.

**Download failed during setup**  
Check your internet connection and make sure you have enough disk space. You can re-run `python setup.py`.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Chart.js, Tailwind CSS
- **Backend:** Flask, Python
- **Database:** Supabase PostgreSQL
- **ML Model:** Random Forest (scikit-learn)
- **Data Processing:** Pandas, NumPy, Matplotlib
- **Dataset:** 3M vehicle records from Kaggle

---

## Notes

- The app was developed and tested on Windows 10 with Python 3.13 and Node.js 22
- The model is trained on 3M used vehicle records
- Sample datasets (10k records) of raw and cleaned data are included in the `data/samples/` folder for reference
---
