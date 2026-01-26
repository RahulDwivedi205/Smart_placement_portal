const StudentProfile = require('../models/StudentProfile');

class PRSService {
  static async calculatePRS(studentId) {
    try {
      const student = await StudentProfile.findOne({ userId: studentId });
      if (!student) {
        return { score: 0, breakdown: {} };
      }

      let totalScore = 0;
      const breakdown = {};

      // Academic Score (40% weightage)
      const academicScore = this.calculateAcademicScore(student);
      totalScore += academicScore * 0.4;
      breakdown.academics = {
        score: Math.round(academicScore),
        maxScore: 100,
        feedback: academicScore >= 80 ? 'Excellent academic performance' : 
                 academicScore >= 60 ? 'Good academic performance' : 'Needs improvement in academics'
      };

      // Skills Score (30% weightage)
      const skillsScore = this.calculateSkillsScore(student);
      totalScore += skillsScore * 0.3;
      breakdown.skills = {
        score: Math.round(skillsScore),
        maxScore: 100,
        feedback: skillsScore >= 80 ? 'Strong technical skills' : 
                 skillsScore >= 60 ? 'Good technical skills' : 'Add more technical skills'
      };

      // Experience Score (20% weightage)
      const experienceScore = this.calculateExperienceScore(student);
      totalScore += experienceScore * 0.2;
      breakdown.experience = {
        score: Math.round(experienceScore),
        maxScore: 100,
        feedback: experienceScore >= 80 ? 'Great project experience' : 
                 experienceScore >= 60 ? 'Good project experience' : 'Add more projects'
      };

      // Profile Completeness (10% weightage)
      const completenessScore = this.calculateCompletenessScore(student);
      totalScore += completenessScore * 0.1;
      breakdown.completeness = {
        score: Math.round(completenessScore),
        maxScore: 100,
        feedback: completenessScore >= 80 ? 'Profile is complete' : 'Complete your profile'
      };

      const finalScore = Math.round(totalScore);
      
      // Update student's PRS in database only if student exists
      if (student) {
        student.placementReadinessScore = finalScore;
        await student.save();
      }

      return { score: finalScore, breakdown };
    } catch (error) {
      console.error('Error calculating PRS:', error);
      return { score: 0, breakdown: {} };
    }
  }

  static calculateAcademicScore(student) {
    if (!student.academics) return 0;
    
    let score = 0;
    
    // CGPA (60% of academic score)
    if (student.academics.cgpa) {
      score += (student.academics.cgpa / 10) * 60;
    }
    
    // 10th marks (20% of academic score)
    if (student.academics.tenthMarks) {
      score += (student.academics.tenthMarks / 100) * 20;
    }
    
    // 12th marks (20% of academic score)
    if (student.academics.twelfthMarks) {
      score += (student.academics.twelfthMarks / 100) * 20;
    }
    
    // Penalty for backlogs
    if (student.academics.backlogs > 0) {
      score -= student.academics.backlogs * 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  static calculateSkillsScore(student) {
    if (!student.skills) return 0;
    
    const allSkills = [
      ...(student.skills.technical || []),
      ...(student.skills.programming || []),
      ...(student.skills.frameworks || []),
      ...(student.skills.tools || [])
    ];
    
    // Base score based on number of skills
    let score = Math.min(allSkills.length * 5, 80);
    
    // Bonus for having skills in multiple categories
    const categories = ['technical', 'programming', 'frameworks', 'tools'];
    const filledCategories = categories.filter(cat => 
      student.skills[cat] && student.skills[cat].length > 0
    );
    
    score += filledCategories.length * 5;
    
    return Math.min(100, score);
  }

  static calculateExperienceScore(student) {
    let score = 0;
    
    // Projects score (70% of experience)
    if (student.projects && student.projects.length > 0) {
      score += Math.min(student.projects.length * 15, 70);
    }
    
    // Work experience score (30% of experience)
    if (student.experience && student.experience.length > 0) {
      score += Math.min(student.experience.length * 15, 30);
    }
    
    return Math.min(100, score);
  }

  static calculateCompletenessScore(student) {
    let completedFields = 0;
    let totalFields = 0;
    
    // Personal info fields
    const personalFields = ['firstName', 'lastName', 'phone', 'rollNumber', 'branch', 'batch'];
    personalFields.forEach(field => {
      totalFields++;
      if (student.personalInfo && student.personalInfo[field]) {
        completedFields++;
      }
    });
    
    // Academic fields
    const academicFields = ['cgpa', 'tenthMarks', 'twelfthMarks'];
    academicFields.forEach(field => {
      totalFields++;
      if (student.academics && student.academics[field]) {
        completedFields++;
      }
    });
    
    // Skills (at least one skill in any category)
    totalFields++;
    if (student.skills) {
      const hasSkills = ['technical', 'programming', 'frameworks', 'tools'].some(cat =>
        student.skills[cat] && student.skills[cat].length > 0
      );
      if (hasSkills) completedFields++;
    }
    
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  }

  static async getPRSBreakdown(studentId) {
    const result = await this.calculatePRS(studentId);
    return result.breakdown || {};
  }
}

module.exports = PRSService;