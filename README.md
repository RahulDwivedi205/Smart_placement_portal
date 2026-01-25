# PlaceWise - Intelligent Campus Placement Portal

A comprehensive, production-ready web application for managing campus placements with intelligent matching, analytics, and automated workflows. Built with modern MERN stack and deployed on Vercel.

## 🚀 Live Demo

- **Frontend**: [https://placewise-client.vercel.app](https://placewise-client.vercel.app)
- **Backend API**: [https://placewise-server.vercel.app](https://placewise-server.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🎯 Core Functionality
- **Role-based Access Control**: Student, Company HR, Placement Admin with distinct dashboards
- **Intelligent Job Matching**: Auto-eligibility engine based on CGPA, branch, skills, and experience
- **Placement Readiness Score (PRS)**: AI-driven assessment of student placement readiness
- **Real-time Analytics**: Comprehensive placement statistics and insights
- **Interview Management**: Complete workflow from application to offer

### 🤖 Intelligent Systems
- **Auto Eligibility Engine**: Automatically matches students to relevant job opportunities
- **Skill Matching Algorithm**: Resume-JD compatibility scoring using NLP techniques
- **PRS Calculator**: Multi-factor scoring system for placement readiness
- **Smart Notifications**: Email alerts for application status updates
- **Analytics Engine**: Branch-wise, company-wise, and skill-wise placement insights

### 👥 User Roles & Capabilities

#### Students
- Complete profile management with academic records
- Browse eligible job opportunities with match scores
- Apply to jobs with cover letters
- Track application status and interview schedules
- View placement readiness score with improvement suggestions
- Access to placement analytics and trends

#### Company HR
- Company profile and verification management
- Post job opportunities with detailed requirements
- View eligible students with matching scores
- Manage applications and schedule interviews
- Track recruitment analytics and success rates
- Interview round management with feedback system

#### Placement Admin
- Monitor entire placement ecosystem
- Approve/reject company registrations
- View comprehensive analytics and reports
- Manage student and company data
- Generate placement statistics and insights
- Oversee interview processes and outcomes

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client for API calls
- **Chart.js & React-Chartjs-2** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending capability
- **Express Validator** - Input validation middleware

### Deployment & DevOps
- **Vercel** - Frontend and backend hosting
- **MongoDB Atlas** - Cloud database
- **Git** - Version control
- **Environment Variables** - Configuration management

## 🏗 Architecture

### Database Schema
```
Users (Authentication)
├── Students Profile (Academic & Personal Info)
├── Company Profile (Company Details & Verification)
└── Admin Profile (System Management)

Jobs (Opportunities)
├── Eligibility Criteria
├── Package Details
└── Application Deadlines

Applications (Student-Job Mapping)
├── Application Status
├── Matching Scores
└── Interview Rounds

Interview Rounds (Process Management)
├── Round Details
├── Scheduling
└── Feedback System
```

### API Architecture
```
/api/auth          - Authentication endpoints
/api/student       - Student-specific operations
/api/company       - Company-specific operations
/api/admin         - Admin management endpoints
/api/jobs          - Job listing and management
/api/applications  - Application tracking
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/placewise.git
   cd placewise
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000" > .env
   
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placewise
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
GET  /api/auth/me          - Get current user
POST /api/auth/logout      - User logout
```

### Student Endpoints
```
GET    /api/student/profile           - Get student profile
PUT    /api/student/profile           - Update student profile
GET    /api/student/jobs/eligible     - Get eligible jobs
POST   /api/student/jobs/:id/apply    - Apply to job
GET    /api/student/applications      - Get applications
GET    /api/student/dashboard         - Dashboard data
GET    /api/student/prs               - Placement readiness score
```

### Company Endpoints
```
GET    /api/company/profile                    - Get company profile
PUT    /api/company/profile                    - Update company profile
POST   /api/company/jobs                       - Create job posting
GET    /api/company/jobs                       - Get company jobs
GET    /api/company/jobs/:id/applications      - Get job applications
POST   /api/company/applications/:id/interview - Schedule interview
PUT    /api/company/applications/:id/status    - Update application status
```

### Admin Endpoints
```
GET /api/admin/dashboard    - Admin dashboard data
GET /api/admin/students     - Get all students
GET /api/admin/companies    - Get all companies
GET /api/admin/jobs         - Get all jobs
GET /api/admin/analytics    - Placement analytics
```

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Fork this repository**

2. **Deploy Backend**
   - Connect your GitHub repo to Vercel
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

3. **Deploy Frontend**
   - Create new Vercel project
   - Set root directory to `frontend`
   - Add `VITE_API_URL` pointing to backend
   - Deploy

4. **Configure Database**
   - Set up MongoDB Atlas cluster
   - Update connection string in backend env

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎯 Key Algorithms

### Eligibility Scoring Algorithm
```javascript
// Multi-factor scoring system
const eligibilityScore = 
  (cgpaScore * 0.3) +           // 30% weightage
  (branchMatch * 0.25) +        // 25% weightage
  (backlogCheck * 0.2) +        // 20% weightage
  (batchMatch * 0.15) +         // 15% weightage
  (skillsMatch * 0.1);          // 10% weightage
```

### Placement Readiness Score (PRS)
```javascript
// Comprehensive assessment
const prs = 
  (academicScore * 0.4) +       // Academic performance
  (skillsScore * 0.3) +         // Technical skills
  (experienceScore * 0.2) +     // Projects & experience
  (profileCompleteness * 0.1);  // Profile completion
```

## 📊 Analytics & Insights

- **Placement Rate Tracking**: Branch-wise and overall placement statistics
- **Company Performance**: Hiring success rates and preferences
- **Skill Demand Analysis**: Most sought-after skills in the market
- **Interview Success Rates**: Round-wise conversion analytics
- **Salary Distribution**: Package-wise placement insights

## 🔒 Security Features

- JWT-based authentication with secure token management
- Password hashing using bcryptjs
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Environment-based configuration management
- Role-based access control (RBAC)

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the robust database
- Vercel for seamless deployment
- Open source community for inspiration

---

## 📈 Project Stats

- **Lines of Code**: 15,000+
- **Components**: 50+
- **API Endpoints**: 25+
- **Database Collections**: 6
- **Features**: 30+

Built with ❤️ for the campus placement community