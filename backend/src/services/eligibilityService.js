const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');

class EligibilityService {
  // Calculate eligibility score for a student-job pair
  static calculateEligibilityScore(student, job) {
    if (!student || !job) return 0;
    
    let score = 0;
    let maxScore = 100;

    // CGPA Check (30 points)
    const studentCGPA = student.academics?.cgpa || 0;
    const requiredCGPA = job.eligibility?.minimumCGPA || 0;
    if (studentCGPA >= requiredCGPA) {
      const cgpaScore = Math.min(30, (studentCGPA / 10) * 30);
      score += cgpaScore;
    }

    // Branch Check (25 points)
    const jobBranches = job.eligibility?.branches || [];
    const studentBranch = student.personalInfo?.branch || '';
    if (jobBranches.includes(studentBranch) || jobBranches.includes('ALL')) {
      score += 25;
    }

    // Backlog Check (20 points)
    const allowBacklogs = job.eligibility?.allowBacklogs || false;
    const studentBacklogs = student.academics?.backlogs || 0;
    const maxBacklogs = job.eligibility?.maxBacklogs || 0;
    if (allowBacklogs || studentBacklogs === 0) {
      if (studentBacklogs <= maxBacklogs) {
        score += 20;
      }
    }

    // Batch Check (15 points)
    const jobBatches = job.eligibility?.batch || [];
    const studentBatch = student.personalInfo?.batch || 0;
    if (jobBatches.includes(studentBatch)) {
      score += 15;
    }

    // Skills Match (10 points)
    const studentSkills = [
      ...(student.skills?.technical || []),
      ...(student.skills?.programming || []),
      ...(student.skills?.frameworks || [])
    ].map(skill => skill.toLowerCase());

    const requiredSkills = (job.eligibility?.requiredSkills || []).map(skill => skill.toLowerCase());
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
    if (!student || !job) return false;
    
    // Basic eligibility checks with safe access
    const cgpaEligible = (student.academics?.cgpa || 0) >= (job.eligibility?.minimumCGPA || 0);
    const branchEligible = (job.eligibility?.branches || []).includes(student.personalInfo?.branch) || 
                          (job.eligibility?.branches || []).includes('ALL');
    const backlogEligible = (job.eligibility?.allowBacklogs || false) || 
                           (student.academics?.backlogs || 0) <= (job.eligibility?.maxBacklogs || 0);
    const batchEligible = (job.eligibility?.batch || []).includes(student.personalInfo?.batch);

    return cgpaEligible && branchEligible && backlogEligible && batchEligible;
  }

  // Get eligible jobs for a student
  static async getEligibleJobs(studentId) {
    try {
      const student = await StudentProfile.findOne({ userId: studentId });
      
      // Get all active jobs
      const activeJobs = await Job.find({ 
        status: 'active',
        applicationDeadline: { $gte: new Date() }
      }).populate('companyId');

      // If no student profile, return all jobs with basic info
      if (!student) {
        return activeJobs.map(job => ({
          ...job.toObject(),
          eligibilityScore: 50 // Default score
        }));
      }

      const eligibleJobs = [];

      for (const job of activeJobs) {
        // If student has basic profile, check eligibility
        if (this.isEligible(student, job)) {
          const eligibilityScore = this.calculateEligibilityScore(student, job);
          eligibleJobs.push({
            ...job.toObject(),
            eligibilityScore
          });
        }
      }

      // If no eligible jobs found, return all jobs with lower scores
      if (eligibleJobs.length === 0) {
        return activeJobs.map(job => ({
          ...job.toObject(),
          eligibilityScore: 30 // Lower score for non-eligible
        }));
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