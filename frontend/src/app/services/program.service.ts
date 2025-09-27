import { Injectable } from '@angular/core';

export interface Program {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  seats: number;
  eligibility: string[];
  careerScope: string[];
  requirements: string[];
  image: string;
  category: string;
  degree: string;
  tuition: number;
  applicationDeadline: string;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  type: 'merit-based' | 'need-based' | 'sports' | 'academic' | 'minority' | 'international';
  amount: string;
  eligibility: string[];
  requirements: string[];
  applicationDeadline: string;
  renewable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private programs: Program[] = [
    {
      id: 'business-administration',
      title: 'Master of Business Administration (MBA)',
      description: 'Our MBA program is designed to develop future business leaders with a comprehensive understanding of modern business practices, strategic thinking, and leadership skills. The program combines theoretical knowledge with practical applications through case studies, internships, and real-world projects.',
      shortDescription: 'Develop leadership skills and business acumen with our comprehensive MBA program.',
      duration: '2 Years',
      seats: 150,
      eligibility: [
        'Bachelor\'s degree from an accredited institution',
        'Minimum GPA of 3.0 (4.0 scale)',
        'GMAT score of 600 or higher (or GRE equivalent)',
        '2+ years of professional work experience',
        'English proficiency (TOEFL 90+ or IELTS 6.5+)'
      ],
      careerScope: [
        'Business Consultant',
        'Operations Manager',
        'Marketing Director',
        'Financial Analyst',
        'Entrepreneur/Startup Founder',
        'Project Manager',
        'Business Development Manager',
        'Corporate Executive'
      ],
      requirements: [
        'Completed application form',
        'Official transcripts',
        'GMAT/GRE scores',
        'Resume/CV',
        'Statement of purpose',
        'Two letters of recommendation',
        'Interview (if shortlisted)'
      ],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Business',
      degree: 'Master\'s',
      tuition: 45000,
      applicationDeadline: 'March 15, 2025'
    },
    {
      id: 'computer-science',
      title: 'Bachelor of Science in Computer Science',
      description: 'Our Computer Science program provides students with a solid foundation in computer science theory and practice. Students learn programming languages, algorithms, data structures, software engineering, and cutting-edge technologies like artificial intelligence, machine learning, and cybersecurity.',
      shortDescription: 'Master cutting-edge technologies and programming languages in our CS program.',
      duration: '4 Years',
      seats: 200,
      eligibility: [
        'High school diploma or equivalent',
        'Minimum GPA of 3.0 (4.0 scale)',
        'SAT score of 1200+ or ACT score of 26+',
        'Strong background in mathematics',
        'English proficiency (TOEFL 80+ or IELTS 6.0+)'
      ],
      careerScope: [
        'Software Developer',
        'Data Scientist',
        'Cybersecurity Analyst',
        'Systems Architect',
        'AI/ML Engineer',
        'DevOps Engineer',
        'Mobile App Developer',
        'Tech Entrepreneur'
      ],
      requirements: [
        'Completed application form',
        'High school transcripts',
        'SAT/ACT scores',
        'Personal statement',
        'Two letters of recommendation',
        'Portfolio (optional but recommended)'
      ],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Technology',
      degree: 'Bachelor\'s',
      tuition: 35000,
      applicationDeadline: 'February 1, 2025'
    },
    {
      id: 'engineering',
      title: 'Bachelor of Engineering',
      description: 'Our comprehensive Engineering program offers specializations in Civil, Mechanical, Electrical, and Computer Engineering. Students gain hands-on experience through laboratory work, design projects, and industry internships, preparing them for successful engineering careers.',
      shortDescription: 'Build the future with our comprehensive engineering programs across multiple disciplines.',
      duration: '4 Years',
      seats: 300,
      eligibility: [
        'High school diploma with strong science and math background',
        'Minimum GPA of 3.2 (4.0 scale)',
        'SAT score of 1250+ or ACT score of 27+',
        'Physics and Chemistry coursework',
        'English proficiency (TOEFL 85+ or IELTS 6.5+)'
      ],
      careerScope: [
        'Civil Engineer',
        'Mechanical Engineer',
        'Electrical Engineer',
        'Software Engineer',
        'Project Manager',
        'Research Engineer',
        'Consulting Engineer',
        'Engineering Manager'
      ],
      requirements: [
        'Completed application form',
        'High school transcripts',
        'SAT/ACT scores',
        'Personal statement',
        'Two letters of recommendation',
        'Math and science teacher recommendations'
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Engineering',
      degree: 'Bachelor\'s',
      tuition: 38000,
      applicationDeadline: 'January 15, 2025'
    }
  ];

  private scholarships: Scholarship[] = [
    {
      id: 'presidential-scholarship',
      title: 'Presidential Excellence Scholarship',
      description: 'Our most prestigious merit-based scholarship awarded to exceptional students who demonstrate outstanding academic achievement, leadership potential, and community involvement.',
      type: 'merit-based',
      amount: 'Full tuition + $5,000 annual stipend',
      eligibility: [
        'Top 5% of graduating class',
        'SAT score of 1500+ or ACT score of 34+',
        'Demonstrated leadership experience',
        'Community service involvement',
        'Strong letters of recommendation'
      ],
      requirements: [
        'Completed scholarship application',
        'Official transcripts',
        'SAT/ACT scores',
        'Leadership portfolio',
        'Community service documentation',
        'Three letters of recommendation',
        'Personal essay'
      ],
      applicationDeadline: 'December 1, 2024',
      renewable: true
    },
    {
      id: 'need-based-grant',
      title: 'Verdia Access Grant',
      description: 'Need-based financial assistance designed to make quality education accessible to students from diverse economic backgrounds.',
      type: 'need-based',
      amount: 'Up to $15,000 annually',
      eligibility: [
        'Demonstrated financial need',
        'Family income below $60,000 annually',
        'Academic potential (GPA 2.5+)',
        'U.S. citizen or eligible non-citizen',
        'Completed FAFSA application'
      ],
      requirements: [
        'Completed scholarship application',
        'FAFSA application',
        'Tax returns (parent/guardian)',
        'Financial need documentation',
        'Personal statement',
        'Two letters of recommendation'
      ],
      applicationDeadline: 'March 1, 2025',
      renewable: true
    },
    {
      id: 'athletic-scholarship',
      title: 'Verdia Athletic Scholarship',
      description: 'Athletic scholarships for student-athletes who excel in their sport while maintaining academic standards.',
      type: 'sports',
      amount: 'Partial to full tuition',
      eligibility: [
        'Exceptional athletic ability',
        'Academic eligibility (GPA 2.5+)',
        'NCAA/NAIA eligibility',
        'Coach recommendation',
        'Athletic achievements'
      ],
      requirements: [
        'Completed scholarship application',
        'Athletic resume',
        'Coach recommendation',
        'Academic transcripts',
        'Video highlights (if applicable)',
        'Medical clearance'
      ],
      applicationDeadline: 'Varies by sport',
      renewable: true
    },
    {
      id: 'international-scholarship',
      title: 'Global Diversity Scholarship',
      description: 'Scholarships specifically designed for international students to promote cultural diversity on campus.',
      type: 'international',
      amount: 'Up to $20,000 annually',
      eligibility: [
        'International student status',
        'Strong academic record',
        'English proficiency',
        'Cultural diversity contribution',
        'Financial need consideration'
      ],
      requirements: [
        'Completed scholarship application',
        'International transcripts',
        'English proficiency scores',
        'Cultural diversity essay',
        'Financial need documentation',
        'Two letters of recommendation'
      ],
      applicationDeadline: 'February 15, 2025',
      renewable: true
    }
  ];

  constructor() { }

  getAllPrograms(): Program[] {
    return this.programs;
  }

  getProgramById(id: string): Program | undefined {
    return this.programs.find(program => program.id === id);
  }

  getAllScholarships(): Scholarship[] {
    return this.scholarships;
  }

  getScholarshipById(id: string): Scholarship | undefined {
    return this.scholarships.find(scholarship => scholarship.id === id);
  }

  getScholarshipsByType(type: string): Scholarship[] {
    return this.scholarships.filter(scholarship => scholarship.type === type);
  }
}
