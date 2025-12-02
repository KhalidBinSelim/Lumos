/**
 * Database Seed Script
 * Run with: node src/seed.js
 * 
 * This will populate the database with sample scholarships for testing
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Scholarship = require('./module/scholarship/scholarship.model');

const sampleScholarships = [
  {
    title: "Tech Leaders Scholarship",
    org: "Tech Foundation Inc.",
    website: "https://techfoundation.org/scholarship",
    description: "The Tech Leaders Scholarship recognizes outstanding students pursuing degrees in computer science who demonstrate leadership, academic excellence, and commitment to using technology for social good.",
    amount: 5000,
    amountDisplay: "$5,000",
    deadline: new Date("2024-02-15"),
    applicationOpens: new Date("2023-12-01"),
    awardNotification: new Date("2024-03-30"),
    renewable: true,
    renewalDetails: "Renewable up to 4 years with 3.5 GPA maintenance",
    region: "U.S. Residents Only",
    location: "National",
    tags: ["CS major", "3.8 GPA", "First-gen"],
    categories: ["STEM", "Leadership"],
    demographics: ["First-Gen"],
    eligibility: [
      "Must be enrolled full-time in an accredited university",
      "Pursuing B.S. in Computer Science or related field",
      "Minimum GPA: 3.5",
      "U.S. Citizen or Permanent Resident",
      "Demonstrate leadership in technology initiatives",
      "First-generation college student (preferred)"
    ],
    eligibilityLevel: ["College"],
    minGPA: 3.5,
    citizenshipRequired: ["U.S. Citizen", "Permanent Resident"],
    majorsRequired: ["Computer Science", "Software Engineering", "Information Technology"],
    requirements: ["Essay (500w)", "Transcript", "1 LOR"],
    essayRequired: true,
    essayPrompt: "Describe a specific way you plan to use technology to create positive social change in your community or the world. Include examples of leadership experiences that have prepared you for this goal.",
    essayWordCount: { min: 500, max: 750 },
    essayCriteria: [
      "Clarity of vision and goals (30%)",
      "Demonstrated leadership and initiative (25%)",
      "Feasibility and impact of proposed project (25%)",
      "Writing quality and authenticity (20%)"
    ],
    transcriptRequired: true,
    lorRequired: 1,
    awardDetails: [
      "Amount: $5,000 per academic year",
      "Renewable: Up to 4 years (maintain 3.5 GPA)",
      "Number of Awards: 20 recipients annually",
      "Disbursement: Direct to institution in Fall semester",
      "Award Notification: March 30, 2024"
    ],
    awardsPerYear: 20,
    applicantsPerYear: 500,
    timeline: [
      { date: "2023-12-01", label: "Application Opens" },
      { date: "2024-02-15", label: "Application Deadline - 11:59 PM EST" },
      { date: "2024-03-01", label: "Application Review Period" },
      { date: "2024-03-30", label: "Winners Announced (via email)" },
      { date: "2024-08-15", label: "Award Disbursement (Fall semester)" }
    ],
    competition: {
      acceptanceRate: "~4% (20/500)",
      similarProfile: ["15 first-gen CS students", "Average GPA: 3.75", "80% had leadership roles"],
      percentile: 65
    },
    orgInfo: {
      type: "501(c)(3) Non-Profit",
      founded: "2010",
      totalAwarded: "$2.5M+",
      contact: "scholarships@techfoundation.org",
      phone: "(555) 123-4567"
    },
    notes: {
      whyFit: [
        "Computer Science major (Required)",
        "3.8 GPA exceeds minimum 3.5 (Required)",
        "First-generation student (Preferred)",
        "Leadership experience in tech club (Preferred)"
      ],
      improve: [
        "Add a research project (+5% match)",
        "Obtain coding competition award (+3% match)"
      ]
    },
    featured: true,
    verified: true,
    active: true
  },
  {
    title: "Women in STEM Award",
    org: "Future Innovators",
    website: "https://futureinnovators.org/stem-award",
    description: "Supporting women pursuing careers in Science, Technology, Engineering, and Mathematics fields.",
    amount: 3000,
    amountDisplay: "$3,000",
    deadline: new Date("2024-03-01"),
    renewable: false,
    region: "National",
    location: "National",
    tags: ["Women", "STEM", "Research"],
    categories: ["STEM", "Academic"],
    demographics: ["Women"],
    eligibility: [
      "Female students enrolled in STEM programs",
      "Minimum GPA: 3.2",
      "Research experience preferred"
    ],
    eligibilityLevel: ["College", "Graduate"],
    minGPA: 3.2,
    citizenshipRequired: ["Any"],
    majorsRequired: ["Engineering", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"],
    requirements: ["Research Project", "No Essay"],
    essayRequired: false,
    transcriptRequired: true,
    lorRequired: 2,
    awardDetails: ["One-time award of $3,000"],
    awardsPerYear: 50,
    applicantsPerYear: 300,
    featured: false,
    verified: true,
    active: true
  },
  {
    title: "Community Service Leaders",
    org: "Global Impact Fund",
    website: "https://globalimpactfund.org",
    description: "Recognizing students who have made significant contributions to their communities through volunteer work.",
    amount: 2500,
    amountDisplay: "$2,500",
    deadline: new Date("2024-03-15"),
    renewable: false,
    region: "National",
    location: "National",
    tags: ["Volunteering", "Leadership"],
    categories: ["Service", "Leadership"],
    demographics: [],
    eligibility: [
      "100+ hours of community service",
      "Leadership role in service organization",
      "Minimum GPA: 3.0"
    ],
    eligibilityLevel: ["High School", "College"],
    minGPA: 3.0,
    citizenshipRequired: ["Any"],
    requirements: ["100+ Hours Service", "Ref"],
    essayRequired: true,
    essayPrompt: "Describe your most impactful community service experience and what you learned from it.",
    essayWordCount: { min: 400, max: 600 },
    transcriptRequired: false,
    lorRequired: 1,
    awardDetails: ["One-time award of $2,500"],
    awardsPerYear: 30,
    applicantsPerYear: 200,
    featured: false,
    verified: true,
    active: true
  },
  {
    title: "NextGen Coding Grant",
    org: "DevWorld",
    website: "https://devworld.io/grant",
    description: "Supporting aspiring software developers with demonstrated coding skills and open-source contributions.",
    amount: 1000,
    amountDisplay: "$1,000",
    deadline: new Date("2024-04-10"),
    renewable: false,
    region: "International",
    location: "International",
    tags: ["Coding", "Project-based"],
    categories: ["STEM"],
    demographics: [],
    eligibility: [
      "Active GitHub portfolio",
      "At least one completed project",
      "Students or self-learners"
    ],
    eligibilityLevel: ["High School", "College", "All"],
    citizenshipRequired: ["Any"],
    requirements: ["GitHub Portfolio"],
    essayRequired: false,
    transcriptRequired: false,
    lorRequired: 0,
    portfolioRequired: true,
    awardDetails: ["One-time grant of $1,000", "Access to DevWorld mentorship program"],
    awardsPerYear: 100,
    applicantsPerYear: 800,
    featured: true,
    verified: true,
    active: true
  },
  {
    title: "Cybersecurity Excellence",
    org: "SecureNet",
    website: "https://securenet.com/scholarship",
    description: "For students pursuing careers in cybersecurity with demonstrated interest in information security.",
    amount: 7500,
    amountDisplay: "$7,500",
    deadline: new Date("2024-02-28"),
    renewable: true,
    renewalDetails: "Renewable for 2 years",
    region: "U.S. Only",
    location: "National",
    tags: ["Cybersecurity", "Certifications"],
    categories: ["STEM"],
    demographics: [],
    eligibility: [
      "Pursuing degree in Cybersecurity or related field",
      "Participation in CTF competitions preferred",
      "Security certifications are a plus"
    ],
    eligibilityLevel: ["College", "Graduate"],
    minGPA: 3.3,
    citizenshipRequired: ["U.S. Citizen", "Permanent Resident"],
    majorsRequired: ["Cybersecurity", "Information Security", "Computer Science"],
    requirements: ["CTF Participation"],
    essayRequired: true,
    essayPrompt: "Discuss a recent cybersecurity threat and how you would approach solving it.",
    essayWordCount: { min: 500, max: 800 },
    transcriptRequired: true,
    lorRequired: 1,
    awardDetails: ["$7,500 per year", "Internship opportunity at SecureNet"],
    awardsPerYear: 10,
    applicantsPerYear: 150,
    featured: false,
    verified: true,
    active: true
  },
  {
    title: "First Generation College Student Award",
    org: "Education First Foundation",
    website: "https://educationfirst.org/first-gen",
    description: "Supporting first-generation college students in achieving their educational goals.",
    amount: 4000,
    amountDisplay: "$4,000",
    deadline: new Date("2024-04-01"),
    renewable: true,
    renewalDetails: "Renewable for up to 4 years",
    region: "National",
    location: "National",
    tags: ["First-Gen", "Need-Based"],
    categories: ["Need-Based", "Academic"],
    demographics: ["First-Gen", "Low-Income"],
    eligibility: [
      "First-generation college student",
      "Demonstrated financial need",
      "Minimum GPA: 2.8"
    ],
    eligibilityLevel: ["College"],
    minGPA: 2.8,
    citizenshipRequired: ["U.S. Citizen", "Permanent Resident", "DACA"],
    requirements: ["Essay", "Financial Info"],
    essayRequired: true,
    essayPrompt: "Share your journey as a first-generation college student and your educational aspirations.",
    essayWordCount: { min: 500, max: 750 },
    transcriptRequired: true,
    lorRequired: 1,
    awardDetails: ["$4,000 per year", "Mentorship program included"],
    awardsPerYear: 50,
    applicantsPerYear: 400,
    featured: true,
    verified: true,
    active: true
  },
  {
    title: "Creative Arts Scholarship",
    org: "Arts Council of America",
    website: "https://artscouncil.org/scholarship",
    description: "Supporting talented artists, musicians, writers, and designers pursuing their creative passions.",
    amount: 3500,
    amountDisplay: "$3,500",
    deadline: new Date("2024-05-01"),
    renewable: false,
    region: "National",
    location: "National",
    tags: ["Art", "Music", "Design", "Writing"],
    categories: ["Arts"],
    demographics: [],
    eligibility: [
      "Pursuing degree in fine arts, music, design, or creative writing",
      "Portfolio submission required",
      "Minimum GPA: 2.5"
    ],
    eligibilityLevel: ["College"],
    minGPA: 2.5,
    citizenshipRequired: ["Any"],
    majorsRequired: ["Fine Arts", "Music", "Graphic Design", "Creative Writing"],
    requirements: ["Portfolio", "Artist Statement"],
    essayRequired: true,
    essayPrompt: "Describe your artistic vision and how this scholarship would help you achieve your creative goals.",
    essayWordCount: { min: 300, max: 500 },
    transcriptRequired: false,
    lorRequired: 1,
    portfolioRequired: true,
    awardDetails: ["One-time award of $3,500"],
    awardsPerYear: 25,
    applicantsPerYear: 180,
    featured: false,
    verified: true,
    active: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing scholarships
    await Scholarship.deleteMany({});
    console.log('Cleared existing scholarships');

    // Insert sample scholarships
    const result = await Scholarship.insertMany(sampleScholarships);
    console.log(`Inserted ${result.length} scholarships`);

    // Log inserted scholarships
    result.forEach(s => {
      console.log(`  - ${s.title} ($${s.amount})`);
    });

    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

