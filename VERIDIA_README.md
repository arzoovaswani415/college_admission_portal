# Veridia University Website

A modern, responsive university website built with Angular 16 and Tailwind CSS, featuring a comprehensive chatbot for prospective students.

## 🎯 Features

### **Design & Styling**
- ✅ **Exact Design Replication**: Matches the provided HTML snippet perfectly
- ✅ **Dark Mode Support**: Toggle between light and dark themes with persistent storage
- ✅ **Fully Responsive**: Mobile-first design that works on all devices
- ✅ **Smooth Animations**: Hover effects, transitions, and loading animations
- ✅ **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### **Functionality**
- ✅ **Smooth Scrolling**: Internal navigation with smooth scroll behavior
- ✅ **Mobile Menu**: Collapsible navigation for mobile devices
- ✅ **Performance Optimized**: Lazy loading images and efficient DOM structure
- ✅ **SEO Friendly**: Semantic HTML structure and meta tags

### **Chatbot Features**
- ✅ **Intelligent Assistant**: Answers common admission questions
- ✅ **FAQ System**: Predefined responses for typical student queries
- ✅ **Real-time Typing**: Simulated typing indicators for better UX
- ✅ **Modal Interface**: Clean, accessible chatbot modal
- ✅ **Mobile Optimized**: Works perfectly on all screen sizes

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v20 or higher)
- Angular CLI (v16.2.1)
- npm or yarn

### **Installation**

1. **Navigate to the frontend directory**
   ```bash
   cd /Users/tanyavaswani/Desktop/Angular/college_admission/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Access the website**
   - Open your browser and go to `http://localhost:4200/veridia`
   - The Veridia University website will load with full functionality

## 🎨 Design Implementation

### **Color Scheme**
```css
Primary: #13a4ec (Blue)
Background Light: #f6f7f8
Background Dark: #101c22
Content Light: #111618
Content Dark: #E2E8F0
```

### **Typography**
- **Font Family**: Public Sans (Google Fonts)
- **Weights**: 400, 500, 700, 900
- **Responsive**: Scales appropriately across devices

### **Components**
- **Header**: Sticky navigation with logo and menu
- **Hero Section**: Full-screen background with overlay text
- **About Section**: Mission, Vision, Values cards
- **Alumni Section**: Graduate testimonials with photos
- **Footer**: Links and copyright information
- **Chatbot**: Floating button with modal interface

## 🤖 Chatbot Functionality

### **Features**
- **Welcome Message**: Greets users on first interaction
- **FAQ Responses**: Answers common questions about:
  - Application deadlines
  - Admission requirements
  - Scholarships and financial aid
  - Available majors
  - Campus visits
- **Typing Simulation**: Realistic conversation flow
- **Mobile Friendly**: Optimized for touch devices

### **Usage**
1. Click the floating chat button (bottom-right)
2. Type your question in the input field
3. Receive instant responses from the assistant
4. Close the chatbot when done

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Features**
- Collapsible navigation menu
- Touch-friendly buttons
- Optimized image sizes
- Readable typography

## 🎯 Accessibility Features

### **ARIA Support**
- Proper labels for all interactive elements
- Screen reader friendly navigation
- Keyboard navigation support
- Focus management

### **Performance**
- Lazy loading for images
- Optimized bundle size
- Efficient CSS with Tailwind
- Smooth animations with reduced motion support

## 🛠️ Technical Stack

### **Frontend**
- **Angular 16.2.1**: Modern framework
- **Tailwind CSS 3.3.0**: Utility-first styling
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming

### **Styling**
- **Tailwind CSS**: Utility classes
- **Custom CSS**: Component-specific styles
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: CSS custom properties

## 📁 File Structure

```
frontend/src/app/components/veridia-university/
├── veridia-university.component.ts      # Component logic
├── veridia-university.component.html    # Template
└── veridia-university.component.css     # Styles

frontend/
├── tailwind.config.js                   # Tailwind configuration
├── postcss.config.js                    # PostCSS configuration
└── package.json                         # Dependencies
```

## 🎨 Customization

### **Colors**
Update the color scheme in `tailwind.config.js`:
```javascript
colors: {
  "primary": "#13a4ec",           // Main brand color
  "background-light": "#f6f7f8",  // Light mode background
  "background-dark": "#101c22",   // Dark mode background
  // ... other colors
}
```

### **Chatbot Questions**
Add new FAQ entries in `veridia-university.component.ts`:
```typescript
faqs = [
  {
    question: "Your question here",
    answer: "Your answer here"
  }
]
```

## 🚀 Deployment

### **Build for Production**
```bash
ng build --configuration production
```

### **Deploy to Static Hosting**
The built files in `dist/` can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

## 🧪 Testing

### **Run Tests**
```bash
ng test
```

### **Build Verification**
```bash
ng build
```

## 📞 Support

For questions or issues:
1. Check the console for errors
2. Verify all dependencies are installed
3. Ensure Angular CLI is up to date
4. Check browser compatibility

## 🎉 Features Summary

✅ **Exact Design Match**: Perfectly replicates the provided HTML
✅ **Dark Mode**: Toggle with persistent storage
✅ **Responsive**: Works on all devices
✅ **Accessible**: ARIA labels and keyboard navigation
✅ **Fast**: Optimized performance
✅ **Chatbot**: Intelligent student assistant
✅ **Modern**: Latest Angular and Tailwind CSS
✅ **Maintainable**: Clean, well-commented code

---

**Built with ❤️ using Angular 16 and Tailwind CSS**
