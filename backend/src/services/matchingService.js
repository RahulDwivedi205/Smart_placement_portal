class MatchingService {
  // Calculate skill match score between student and job
  static calculateSkillMatchScore(studentSkills, jobRequiredSkills) {
    if (!jobRequiredSkills || jobRequiredSkills.length === 0) {
      return 85; // Default score if no specific skills required
    }

    const normalizedStudentSkills = this.normalizeSkills(studentSkills);
    const normalizedJobSkills = this.normalizeSkills(jobRequiredSkills);

    let matchedSkills = 0;
    let partialMatches = 0;

    normalizedJobSkills.forEach(jobSkill => {
      const exactMatch = normalizedStudentSkills.find(studentSkill => 
        studentSkill === jobSkill
      );
      
      if (exactMatch) {
        matchedSkills++;
      } else {
        // Check for partial matches (similar technologies)
        const partialMatch = normalizedStudentSkills.find(studentSkill => 
          this.isRelatedSkill(studentSkill, jobSkill)
        );
        if (partialMatch) {
          partialMatches++;
        }
      }
    });

    // Calculate score: exact matches get full points, partial matches get half
    const exactScore = (matchedSkills / normalizedJobSkills.length) * 70;
    const partialScore = (partialMatches / normalizedJobSkills.length) * 30;
    
    return Math.min(100, Math.round(exactScore + partialScore));
  }

  // Normalize skills for better matching
  static normalizeSkills(skills) {
    const allSkills = [];
    
    if (Array.isArray(skills)) {
      allSkills.push(...skills);
    } else if (typeof skills === 'object') {
      // Handle student skills object
      Object.values(skills).forEach(skillArray => {
        if (Array.isArray(skillArray)) {
          allSkills.push(...skillArray);
        }
      });
    }

    return allSkills
      .map(skill => skill.toLowerCase().trim())
      .filter(skill => skill.length > 0);
  }

  // Check if two skills are related
  static isRelatedSkill(skill1, skill2) {
    const relatedSkills = {
      'javascript': ['js', 'node', 'nodejs', 'react', 'vue', 'angular'],
      'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy'],
      'java': ['spring', 'springboot', 'hibernate', 'maven'],
      'react': ['reactjs', 'jsx', 'redux', 'nextjs'],
      'node': ['nodejs', 'express', 'expressjs'],
      'mongodb': ['mongo', 'mongoose'],
      'mysql': ['sql', 'database'],
      'aws': ['amazon web services', 'ec2', 's3', 'lambda'],
      'docker': ['containerization', 'kubernetes'],
      'git': ['github', 'version control']
    };

    for (const [mainSkill, related] of Object.entries(relatedSkills)) {
      if ((skill1.includes(mainSkill) && related.some(r => skill2.includes(r))) ||
          (skill2.includes(mainSkill) && related.some(r => skill1.includes(r)))) {
        return true;
      }
    }

    // Check for partial string matches
    return skill1.includes(skill2) || skill2.includes(skill1);
  }

  // Calculate overall compatibility score
  static calculateOverallScore(eligibilityScore, skillMatchScore, prsScore) {
    // Weighted average: eligibility (40%), skills (35%), PRS (25%)
    const weightedScore = (eligibilityScore * 0.4) + (skillMatchScore * 0.35) + (prsScore * 0.25);
    return Math.round(weightedScore);
  }

  // Get skill recommendations for student based on market demand
  static getSkillRecommendations(studentSkills, targetRole = 'software_developer') {
    const roleSkillMap = {
      'software_developer': [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 
        'SQL', 'Git', 'AWS', 'Docker', 'MongoDB'
      ],
      'data_scientist': [
        'Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 
        'NumPy', 'Tableau', 'TensorFlow', 'Statistics'
      ],
      'frontend_developer': [
        'JavaScript', 'React', 'Vue.js', 'HTML', 'CSS', 
        'TypeScript', 'Webpack', 'SASS', 'Redux'
      ],
      'backend_developer': [
        'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 
        'Express.js', 'Spring Boot', 'Docker', 'AWS'
      ]
    };

    const recommendedSkills = roleSkillMap[targetRole] || roleSkillMap['software_developer'];
    const normalizedStudentSkills = this.normalizeSkills(studentSkills);
    
    const missingSkills = recommendedSkills.filter(skill => 
      !normalizedStudentSkills.some(studentSkill => 
        studentSkill.includes(skill.toLowerCase()) || 
        this.isRelatedSkill(studentSkill, skill.toLowerCase())
      )
    );

    return {
      recommended: recommendedSkills,
      missing: missingSkills,
      hasSkills: recommendedSkills.filter(skill => !missingSkills.includes(skill))
    };
  }

  // Calculate overall matching score between student and job
  static async calculateMatchingScore(student, job) {
    try {
      const EligibilityService = require('./eligibilityService');
      const PRSService = require('./prsService');

      // Check basic eligibility (40% weight)
      const isEligible = EligibilityService.isEligible(student, job);
      const eligibilityScore = isEligible ? 100 : 0;

      // Calculate skill match (35% weight)
      const skillMatchScore = this.calculateSkillMatchScore(
        student.skills, 
        job.eligibility?.requiredSkills || []
      );

      // Get PRS score (25% weight)
      const prsResult = await PRSService.calculatePRS(student.userId);
      const prsScore = prsResult.score || 0;

      // Calculate weighted overall score
      const overallScore = this.calculateOverallScore(eligibilityScore, skillMatchScore, prsScore);

      return {
        overallScore,
        breakdown: {
          eligibility: eligibilityScore,
          skillMatch: skillMatchScore,
          prs: prsScore
        }
      };
    } catch (error) {
      console.error('Error calculating matching score:', error);
      return {
        overallScore: 0,
        breakdown: {
          eligibility: 0,
          skillMatch: 0,
          prs: 0
        }
      };
    }
  }

  // Analyze job market trends (mock implementation)
  static getJobMarketInsights() {
    return {
      topSkills: [
        { skill: 'JavaScript', demand: 95, growth: 12 },
        { skill: 'Python', demand: 90, growth: 18 },
        { skill: 'React', demand: 85, growth: 15 },
        { skill: 'Node.js', demand: 80, growth: 10 },
        { skill: 'AWS', demand: 75, growth: 25 },
        { skill: 'Docker', demand: 70, growth: 20 },
        { skill: 'MongoDB', demand: 65, growth: 8 },
        { skill: 'TypeScript', demand: 60, growth: 30 }
      ],
      salaryTrends: {
        'JavaScript': { min: 400000, max: 1200000, avg: 800000 },
        'Python': { min: 500000, max: 1500000, avg: 900000 },
        'React': { min: 450000, max: 1300000, avg: 850000 },
        'Node.js': { min: 400000, max: 1100000, avg: 750000 }
      }
    };
  }
}

module.exports = MatchingService;