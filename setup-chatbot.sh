#!/bin/bash

# Veridia University Chatbot Setup Script
echo "🎓 Setting up Veridia University Chatbot..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Python dependencies installed successfully"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Node.js dependencies installed successfully"
else
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

# Install Angular dependencies
echo "📦 Installing Angular dependencies..."
cd ../frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Angular dependencies installed successfully"
else
    echo "❌ Failed to install Angular dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
cd ../backend
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/veridia_admissions

# Server Configuration
PORT=3000
NODE_ENV=development

# Google AI Configuration
GOOGLE_API_KEY=your_google_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
EOF
    echo "✅ .env file created. Please update with your actual API keys."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your Google API key"
echo "2. Start the backend server: cd backend && npm run dev"
echo "3. Start the frontend server: cd frontend && npm start"
echo "4. Visit http://localhost:4200/chatbot to use the chatbot"
echo ""
echo "🔑 Don't forget to:"
echo "- Get a Google API key from https://console.cloud.google.com/"
echo "- Add the API key to your .env file"
echo "- Ensure MongoDB is running on your system"
