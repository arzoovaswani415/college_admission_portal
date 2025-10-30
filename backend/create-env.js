// Simple script to create environment variables
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_admission';
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

console.log('✅ Environment variables set:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI);
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- JWT_SECRET: [SET]');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '[SET]' : '[NOT SET - Using fallback mode]');

module.exports = {};
