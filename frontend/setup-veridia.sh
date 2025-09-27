#!/bin/bash

# Veridia University Website Setup Script
echo "🎓 Setting up Veridia University Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20 or higher."
    exit 1
fi

# Check if Angular CLI is installed
if ! command -v ng &> /dev/null; then
    echo "📦 Installing Angular CLI..."
    npm install -g @angular/cli@16.2.1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
ng build --configuration development

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To start the development server:"
    echo "   ng serve"
    echo ""
    echo "🌐 To view the Veridia University website:"
    echo "   Open http://localhost:4200/veridia in your browser"
    echo ""
    echo "📚 For more information, see VERIDIA_README.md"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
