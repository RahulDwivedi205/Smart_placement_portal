const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');

class EligibilityService {
  // Calculate eligibility score for a student-job pair
  static calculateEligibilityScore(student, job) {
    let score = 0;
    let maxScore = 100;

    // CGPA Check (30 points)
    if (student.academics.cgpa >= job.eligibility.minimumCGPA) {
      const cgpaScore = Math.min(30, (student.academics.cgpa / 10) * 30);
      score += cgpaScore;
    }

    // Branch Check (25 points)
    if (job.eligibility.branches.includes(student.personalInfo.branch) || 
        job.eligibility.branches.includes('ALL')) {
      score += 25;
    }

    // Backlog Check (20 points)
    if (job.eligibility.allowBacklogs || student.academics.backlogs === 0) {
      if (student.academics.backlogs <= job.eligibility.maxBacklogs) {
        score += 20;
      }
    }

    // Batch Check (15 points)
    if (job.eligibility.batch.includes(student.personalInfo.batch)) {
      score += 15;
    }

    // Skills Match (10 points)
    const studentSkills = [
      ...student.skills.technical,
      ...student.skills.programming,
      ...student.skills.frameworks
    ].map(skill => skill.toLowerCase());

    const requiredSkills = job.eligibility.requiredSkills.map(skill => skill.toLowerCase());
    const matchedSkills = requiredSkills.filter(skill => 
      studentSkills.some(studentSkill => studentSkill.includes(skill))
    );

    if (requiredSkills.length > 0) {
      const skillScore = (matchedSkills.length / requiredSkills.length) * 10;
      score += skillScore;
    } else {
      score += 10; // Full points if no specific skills required
    }

    return Math.round(score);
  }

  // Check if student is eligible for a job
  static isEligible(student, job) {
    // Basic eligibility checks
    const cgpaEligible = student.academics.cgpa >= job.eligibility.minimumCGPA;
    const branchEligible = job.eligibility.branches.includes(student.personalInfo.branch) || 
                          job.eligibility.branches.includes('ALL');
    const backlogEligible = job.eligibility.allowBacklogs || 
                           student.academics.backlogs <= job.eligibility.maxBacklogs;
    const batchEligible = job.eligibility.batch.includes(student.personalInfo.batch);

    return cgpaEligible && branchEligible && backlogEligible && batchEligible;
  }

  // Get eligible jobs for a student
  static async getEligibleJobs(studentId) {
    try {
      const student = await StudentProfile.findOne({ userId: studentId });
      if (!student) {
        throw new Error('Student profile not found');
      }

      const activeJobs = await Job.find({ 
        status: 'active',
        applicationDeadline: { $gte: new Date() }
      }).populate('companyId');

      const eligibleJobs = [];

      for (const job of activeJobs) {
        if (this.isEligible(student, job)) {
          const eligibilityScore = this.calculateEligibilityScore(student, job);
          eligibleJobs.push({
            ...job.toObject(),
            eligibilityScore
          });
        }
      }

      // Sort by eligibility score (highest first)
      return eligibleJobs.sort((a, b) => b.eligibilityScore - a.eligibilityScore);
    } catch (error) {
      throw new Error(`Error fetching eligible jobs: ${error.message}`);
    }
  }

  // Get eligible students for a job
  static async getEligibleStudents(jobId) {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      const students = await StudentProfile.find({
        'personalInfo.branch': { $in: job.eligibility.branches },
        'personalInfo.batch': { $in: job.eligibility.batch },
        'academics.cgpa': { $gte: job.eligibility.minimumCGPA },
        'academics.backlogs': job.eligibility.allowBacklogs ? 
          { $lte: job.eligibility.maxBacklogs } : 0
      }).populate('userId', 'email');

      const eligibleStudents = students.map(student => ({
        ...student.toObject(),
        eligibilityScore: this.calculateEligibilityScore(student, job)
      }));

      // Sort by eligibility score (highest first)
      return eligibleStudents.sort((a, b) => b.eligibilityScore - a.eligibilityScore);
    } catch (error) {
      throw new Error(`Error fetching eligible students: ${error.message}`);
    }
  }
}

module.exports = EligibilityService;