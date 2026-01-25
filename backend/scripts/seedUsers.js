const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const User = require('../src/models/User');
const StudentProfile = require('../src/models/StudentProfile');
const Company = require('../src/models/Company');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Company.deleteMany({});
    
    console.log('Cleared existing users');

    const testUsers = [
      {
        email: 'student1@test.com',
        password: 'password123',
        role: 'student'
      },
      {
        email: 'company@test.com',
        password: 'company123',
        role: 'company'
      },
      {
        email: 'admin@placewise.com',
        password: 'admin123',
        role: 'admin'
      }
    ];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email} (${user.role})`);

      if (user.role === 'student') {
        const studentProfile = new StudentProfile({
          userId: user._id,
          personalInfo: {
            firstName: 'Test',
            lastName: 'Student',
            phone: '+1234567890',
            rollNumber: 'CS2021001',
            branch: 'CSE',
            batch: 2021,
            currentSemester: 7
          },
          academics: {
            cgpa: 8.5,
            tenthMarks: 85,
            twelfthMarks: 88,
            backlogs: 0,
            achievements: ['Dean\'s List', 'Coding Competition Winner']
          },
          skills: {
            technical: ['JavaScript', 'Python', 'Java'],
            programming: ['React', 'Node.js', 'Express'],
            frameworks: ['React', 'Express', 'Django'],
            databases: ['MongoDB', 'MySQL'],
            tools: ['Git', 'Docker', 'VS Code']
          },
          projects: [{
            title: 'E-commerce Website',
            description: 'Full-stack e-commerce application',
            technologies: ['React', 'Node.js', 'MongoDB'],
            githubLink: 'https://github.com/test/ecommerce',
            duration: '3 months'
          }]
        });
        await studentProfile.save();
        console.log(`Created student profile for: ${user.email}`);
      } else if (user.role === 'company') {
        const companyProfile = new Company({
          userId: user._id,
          companyInfo: {
            name: 'Tech Corp',
            industry: 'Technology',
            size: 'large',
            website: 'https://techcorp.com',
            description: 'Leading technology company',
            headquarters: 'Silicon Valley',
            founded: 2010
          },
          hrDetails: {
            name: 'John Smith',
            designation: 'HR Manager',
            phone: '+1234567890',
            alternateEmail: 'john.smith@techcorp.com'
          },
          preferences: {
            preferredBranches: ['CSE', 'IT', 'ECE'],
            minimumCGPA: 7.0,
            allowBacklogs: false,
            maxBacklogs: 0
          },
          isVerified: true,
          verifiedAt: new Date()
        });
        await companyProfile.save();
        console.log(`Created company profile for: ${user.email}`);
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Student: student1@test.com / password123');
    console.log('Company: company@test.com / company123');
    console.log('Admin: admin@placewise.com / admin123');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  seedUsers();
});