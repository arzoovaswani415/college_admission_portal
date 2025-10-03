@echo off
echo 🎓 Starting Veridia University Chatbot...

echo.
echo 📦 Installing dependencies...

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo Installing Angular dependencies...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Angular dependencies
    pause
    exit /b 1
)

echo.
echo ✅ All dependencies installed successfully!
echo.
echo 📋 Next steps:
echo 1. Update backend/.env with your Google API key
echo 2. Start the backend server: cd backend ^&^& npm run dev
echo 3. Start the frontend server: cd frontend ^&^& npm start
echo 4. Visit http://localhost:4200/chatbot to use the chatbot
echo.
echo 🔑 Don't forget to:
echo - Get a Google API key from https://console.cloud.google.com/
echo - Add the API key to your .env file
echo - Ensure MongoDB is running on your system
echo.
pause
