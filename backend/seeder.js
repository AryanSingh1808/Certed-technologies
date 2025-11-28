const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('./models/Course');

// Create CourseCategory Schema
const courseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: String,
    icon: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const CourseCategory = mongoose.model('CourseCategory', courseCategorySchema);

// ============================================
// COURSE CATEGORIES DATA
// ============================================
const categories = [
  {
    name: 'Diploma',
    slug: 'diploma',
    description: 'Comprehensive diploma programs in various IT domains',
    icon: 'diploma'
  },
  {
    name: 'School of AI',
    slug: 'school-of-ai',
    description: 'Artificial Intelligence and Machine Learning courses',
    icon: 'ai'
  },
  {
    name: '.NET',
    slug: 'dotnet',
    description: '.NET Framework and ASP.NET development',
    icon: 'dotnet'
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'Python programming and data science',
    icon: 'python'
  },
  {
    name: 'Java',
    slug: 'java',
    description: 'Core Java and enterprise Java development',
    icon: 'java'
  },
  {
    name: 'Web Designing',
    slug: 'web-designing',
    description: 'Web design and UI/UX principles',
    icon: 'web-design'
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend and full-stack web development',
    icon: 'web-dev'
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Android and iOS mobile app development',
    icon: 'mobile'
  },
  {
    name: 'Database Administration',
    slug: 'database-admin',
    description: 'Database design and administration',
    icon: 'database'
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'AWS, Azure, and cloud infrastructure',
    icon: 'cloud'
  }
];

// ============================================
// COURSES DATA
// ============================================
const coursesData = [
  // DIPLOMA COURSES
  {
    title: 'Advanced Diploma in Information Technology',
    description: 'Comprehensive IT diploma covering core programming and web technologies',
    category: 'Diploma',
    level: 'Beginner',
    duration: '12 months',
    price: 75000,
    instructor: 'Experienced IT Professionals',
    overview: `
      <p><strong>Advanced Diploma in Information Technology</strong> is a comprehensive 12-month program designed for aspiring IT professionals. This diploma covers fundamental and advanced concepts in programming, database management, and web development.</p>
      <h5>Program Highlights:</h5>
      <ul>
        <li>Industry-relevant curriculum aligned with current market demands</li>
        <li>Hands-on training with live projects</li>
        <li>Expert instructors with 10+ years of industry experience</li>
        <li>Career guidance and placement assistance</li>
        <li>Flexible batches: Weekend and weekday options available</li>
      </ul>
      <p>Upon completion, students will be proficient in multiple programming languages and ready for entry-level positions in leading IT companies.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Foundation & Core Programming',
        topics: [
          'Introduction to IT Industry',
          'Problem Solving & Algorithms',
          'Data Structures Fundamentals',
          'Object-Oriented Programming Concepts',
          'Introduction to C Programming'
        ]
      },
      {
        moduleTitle: 'Advanced Programming Languages',
        topics: [
          'Core Java Programming',
          'Advanced Java Features',
          'Exception Handling',
          'Collections Framework',
          'Multithreading in Java'
        ]
      },
      {
        moduleTitle: 'Database Management',
        topics: [
          'Relational Database Concepts',
          'SQL Fundamentals',
          'Advanced SQL Queries',
          'Database Normalization',
          'PL/SQL Programming'
        ]
      },
      {
        moduleTitle: 'Web Development Basics',
        topics: [
          'HTML & CSS Fundamentals',
          'JavaScript Essentials',
          'DOM Manipulation',
          'Introduction to jQuery',
          'Responsive Design Principles'
        ]
      },
      {
        moduleTitle: 'Industry Project Work',
        topics: [
          'Real-world Project Implementation',
          'Team Collaboration',
          'Version Control with Git',
          'Code Quality & Documentation',
          'Project Deployment'
        ]
      }
    ],
    prerequisites: `
      <ul>
        <li>12th pass or equivalent (HSC/Senior Secondary)</li>
        <li>Basic computer literacy</li>
        <li>Passion for learning technology</li>
        <li>Ability to dedicate 20+ hours per week</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Recent 12th pass students</li>
        <li>Career changers looking to enter IT industry</li>
        <li>College students seeking industry training</li>
        <li>Self-taught programmers wanting structured learning</li>
      </ul>
    `,
    enrolledCount: 245,
    rating: 4.5,
    reviews: []
  },
  {
    title: 'Software Development Diploma',
    description: 'Master full-stack development and software engineering principles',
    category: 'Diploma',
    level: 'Beginner',
    duration: '12 months',
    price: 85000,
    instructor: 'Software Engineering Experts',
    overview: `
      <p><strong>Software Development Diploma</strong> is an intensive program that transforms beginners into skilled software developers. Learn the complete software development lifecycle from design to deployment.</p>
      <h5>What You'll Learn:</h5>
      <ul>
        <li>Full-stack web development</li>
        <li>Software design patterns and principles</li>
        <li>Testing and quality assurance</li>
        <li>DevOps and deployment practices</li>
        <li>Real-world project experience</li>
      </ul>
    `,
    curriculum: [
      {
        moduleTitle: 'Programming Fundamentals',
        topics: ['Python Basics', 'Control Structures', 'Functions', 'File Handling', 'Debugging Techniques']
      },
      {
        moduleTitle: 'Object-Oriented Programming',
        topics: ['Classes and Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Design Patterns']
      },
      {
        moduleTitle: 'Backend Development',
        topics: ['Server Architecture', 'RESTful APIs', 'Authentication', 'Database Design', 'Microservices']
      },
      {
        moduleTitle: 'Frontend Technologies',
        topics: ['React.js Fundamentals', 'State Management', 'Component Design', 'Styling', 'Performance Optimization']
      },
      {
        moduleTitle: 'Full-Stack Integration',
        topics: ['API Integration', 'CRUD Operations', 'Error Handling', 'Security Best Practices', 'Deployment']
      }
    ],
    prerequisites: `
      <ul>
        <li>High school education (12th pass)</li>
        <li>Basic computer knowledge</li>
        <li>Logical thinking ability</li>
        <li>Commitment to 25 hours per week</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Beginners wanting to become software developers</li>
        <li>Engineering students seeking practical skills</li>
        <li>Career switchers entering software development</li>
        <li>Entrepreneurs planning to build tech products</li>
      </ul>
    `,
    enrolledCount: 312,
    rating: 4.6,
    reviews: []
  },
  {
    title: 'IT Infrastructure & DevOps Diploma',
    description: 'Learn infrastructure management, cloud services, and DevOps practices',
    category: 'Diploma',
    level: 'Intermediate',
    duration: '6 months',
    price: 65000,
    instructor: 'DevOps & Infrastructure Specialists',
    overview: `
      <p><strong>IT Infrastructure & DevOps Diploma</strong> prepares you for roles in infrastructure management and DevOps. This program covers cloud platforms, containerization, and CI/CD pipelines.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Linux Administration',
        topics: ['Linux Basics', 'User Management', 'File Systems', 'Shell Scripting', 'Networking']
      },
      {
        moduleTitle: 'Cloud Platforms',
        topics: ['AWS Fundamentals', 'EC2 Instances', 'S3 Storage', 'RDS Databases', 'VPC & Security']
      },
      {
        moduleTitle: 'Containerization',
        topics: ['Docker Fundamentals', 'Container Images', 'Docker Compose', 'Registry Management', 'Best Practices']
      },
      {
        moduleTitle: 'Orchestration & Deployment',
        topics: ['Kubernetes Basics', 'Pods & Services', 'CI/CD Pipelines', 'Jenkins', 'Automated Deployments']
      },
      {
        moduleTitle: 'Monitoring & Logging',
        topics: ['System Monitoring', 'Application Logs', 'ELK Stack', 'Prometheus', 'Alert Management']
      }
    ],
    prerequisites: `
      <ul>
        <li>Basic understanding of operating systems</li>
        <li>Networking fundamentals</li>
        <li>Some programming experience (optional but helpful)</li>
        <li>Ability to work with command line</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>System administrators wanting to upgrade skills</li>
        <li>Developers interested in DevOps</li>
        <li>IT professionals pursuing infrastructure roles</li>
        <li>Cloud engineers and architects</li>
      </ul>
    `,
    enrolledCount: 178,
    rating: 4.4,
    reviews: []
  },
  {
    title: 'AI & Machine Learning Fundamentals',
    description: 'Learn AI, ML algorithms, and build intelligent applications',
    category: 'School of AI',
    level: 'Beginner',
    duration: '4 months',
    price: 55000,
    instructor: 'AI & ML Researchers',
    overview: `
      <p><strong>AI & Machine Learning Fundamentals</strong> is designed for learners who want to understand the core concepts of artificial intelligence and machine learning from scratch.</p>
      <h5>Course Features:</h5>
      <ul>
        <li>Complete ML algorithms explained with real examples</li>
        <li>Hands-on projects using industry datasets</li>
        <li>Python for ML implementation</li>
        <li>Model evaluation and optimization techniques</li>
        <li>Real-world case studies and applications</li>
      </ul>
    `,
    curriculum: [
      {
        moduleTitle: 'AI Fundamentals',
        topics: [
          'What is Artificial Intelligence',
          'AI vs ML vs Deep Learning',
          'Problem Solving in AI',
          'Search Algorithms',
          'Knowledge Representation'
        ]
      },
      {
        moduleTitle: 'Machine Learning Basics',
        topics: [
          'Supervised Learning',
          'Unsupervised Learning',
          'Reinforcement Learning',
          'Training vs Testing',
          'Cross Validation'
        ]
      },
      {
        moduleTitle: 'ML Algorithms',
        topics: [
          'Linear & Logistic Regression',
          'Decision Trees',
          'Random Forests',
          'Support Vector Machines',
          'Clustering Algorithms'
        ]
      },
      {
        moduleTitle: 'Deep Learning Basics',
        topics: [
          'Neural Networks',
          'Perceptrons',
          'Backpropagation',
          'Activation Functions',
          'Introduction to TensorFlow'
        ]
      },
      {
        moduleTitle: 'Real-World ML Projects',
        topics: [
          'Predictive Modeling',
          'Classification Problems',
          'Regression Analysis',
          'Data Preprocessing',
          'Model Deployment'
        ]
      }
    ],
    prerequisites: `
      <ul>
        <li>Python programming basics (loops, functions)</li>
        <li>Basic mathematics (statistics, linear algebra)</li>
        <li>Understanding of data structures</li>
        <li>Curiosity about AI and machine learning</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Aspiring data scientists</li>
        <li>Software engineers wanting to learn ML</li>
        <li>Developers interested in AI applications</li>
        <li>Career changers entering AI field</li>
      </ul>
    `,
    enrolledCount: 456,
    rating: 4.7,
    reviews: []
  },
  {
    title: 'ASP.NET Core Web Development',
    description: 'Build modern web applications using ASP.NET Core framework',
    category: '.NET',
    level: 'Intermediate',
    duration: '3 months',
    price: 48000,
    instructor: '.NET Framework Experts',
    overview: `
      <p><strong>ASP.NET Core Web Development</strong> teaches you to build scalable, high-performance web applications using the latest .NET framework.</p>
    `,
    curriculum: [
      {
        moduleTitle: '.NET Core Fundamentals',
        topics: ['.NET Core Overview', 'C# Basics', 'Project Structure', 'Dependencies', 'Configuration']
      },
      {
        moduleTitle: 'ASP.NET Core Essentials',
        topics: ['Routing', 'Controllers', 'Views', 'Razor Templates', 'Middleware']
      },
      {
        moduleTitle: 'Data Access with EF Core',
        topics: ['DbContext', 'LINQ Queries', 'Relationships', 'Migrations', 'Query Optimization']
      },
      {
        moduleTitle: 'API Development',
        topics: ['RESTful Principles', 'HTTP Methods', 'Data Validation', 'Error Handling', 'API Versioning']
      },
      {
        moduleTitle: 'Security & Deployment',
        topics: ['Authentication', 'Authorization', 'HTTPS & SSL', 'Dependency Injection', 'Docker & Azure Deployment']
      }
    ],
    prerequisites: `
      <ul>
        <li>Strong C# programming knowledge</li>
        <li>Understanding of web development concepts</li>
        <li>Familiarity with relational databases</li>
        <li>Basic knowledge of web protocols (HTTP)</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>C# developers transitioning to web</li>
        <li>Full-stack developers</li>
        <li>Enterprise application developers</li>
        <li>Developers seeking .NET career opportunities</li>
      </ul>
    `,
    enrolledCount: 267,
    rating: 4.5,
    reviews: []
  },
  {
    title: 'Python Programming from Zero to Hero',
    description: 'Complete Python course for beginners with projects and real-world applications',
    category: 'Python',
    level: 'Beginner',
    duration: '2 months',
    price: 28000,
    instructor: 'Python Educators',
    overview: `
      <p><strong>Python Programming from Zero to Hero</strong> is designed for absolute beginners. Learn Python step-by-step with hands-on projects.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Python Basics',
        topics: ['Installation & Setup', 'Variables', 'Data Types', 'Operators', 'Input/Output']
      },
      {
        moduleTitle: 'Control Flow',
        topics: ['If Statements', 'Loops', 'Break & Continue', 'Loop Control', 'Logical Operators']
      },
      {
        moduleTitle: 'Functions & Modules',
        topics: ['Defining Functions', 'Parameters', 'Return Values', 'Built-in Functions', 'Creating Modules']
      },
      {
        moduleTitle: 'Data Structures',
        topics: ['Lists', 'Tuples', 'Dictionaries', 'Sets', 'String Operations']
      },
      {
        moduleTitle: 'Practical Projects',
        topics: ['Calculator Application', 'TODO List', 'Hangman Game', 'Web Scraper', 'Automation Scripts']
      }
    ],
    prerequisites: `
      <ul>
        <li>No prior programming experience needed</li>
        <li>Basic computer literacy</li>
        <li>Willingness to practice coding daily</li>
        <li>Logical thinking ability</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Complete beginners in programming</li>
        <li>Students exploring tech careers</li>
        <li>Career switchers</li>
        <li>Hobbyists interested in coding</li>
      </ul>
    `,
    enrolledCount: 523,
    rating: 4.6,
    reviews: []
  },
  {
    title: 'Core Java Programming',
    description: 'Master Java fundamentals, OOP, and build robust applications',
    category: 'Java',
    level: 'Beginner',
    duration: '2.5 months',
    price: 35000,
    instructor: 'Java Programming Experts',
    overview: `
      <p><strong>Core Java Programming</strong> is a foundational course covering Java language basics to advanced OOP concepts.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Java Basics',
        topics: ['Java Syntax', 'Data Types', 'Operators', 'Control Statements', 'Methods']
      },
      {
        moduleTitle: 'Object-Oriented Programming',
        topics: ['Classes & Objects', 'Constructors', 'Inheritance', 'Polymorphism', 'Encapsulation']
      },
      {
        moduleTitle: 'Advanced OOP',
        topics: ['Interfaces', 'Abstract Classes', 'Inner Classes', 'Packages', 'Access Modifiers']
      },
      {
        moduleTitle: 'Collections & Exceptions',
        topics: ['Exception Handling', 'Arrays', 'Collections', 'Generics', 'Iterators']
      },
      {
        moduleTitle: 'Practical Applications',
        topics: ['File I/O', 'Multithreading', 'Serialization', 'Reflection', 'Project Implementation']
      }
    ],
    prerequisites: `
      <ul>
        <li>Basic programming knowledge (any language)</li>
        <li>Logical thinking ability</li>
        <li>Willingness to practice coding</li>
        <li>Computer with Java installed</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Beginners learning Java</li>
        <li>Programmers from other languages</li>
        <li>Computer science students</li>
        <li>Career changers entering IT</li>
      </ul>
    `,
    enrolledCount: 401,
    rating: 4.5,
    reviews: []
  },
  {
    title: 'Web Design & UI/UX Fundamentals',
    description: 'Learn web design principles, UI/UX design, and create beautiful interfaces',
    category: 'Web Designing',
    level: 'Beginner',
    duration: '2 months',
    price: 32000,
    instructor: 'UI/UX Design Professionals',
    overview: `
      <p><strong>Web Design & UI/UX Fundamentals</strong> teaches you to design beautiful, user-centered web interfaces.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Design Principles',
        topics: ['Color Theory', 'Typography', 'Composition', 'Visual Hierarchy', 'Whitespace']
      },
      {
        moduleTitle: 'UI Design',
        topics: ['UI Elements', 'Buttons & Forms', 'Navigation', 'Icons', 'Design Systems']
      },
      {
        moduleTitle: 'UX Fundamentals',
        topics: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Information Architecture']
      },
      {
        moduleTitle: 'Design Tools',
        topics: ['Figma Basics', 'Design Components', 'Collaboration', 'Handoff Process', 'Style Guides']
      },
      {
        moduleTitle: 'Practical Projects',
        topics: ['Landing Pages', 'Website Redesign', 'Mobile UI Design', 'Portfolio Projects', 'Case Studies']
      }
    ],
    prerequisites: `
      <ul>
        <li>Basic design thinking</li>
        <li>Creative mindset</li>
        <li>Attention to detail</li>
        <li>Familiarity with computers</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Aspiring web designers</li>
        <li>Graphic designers transitioning to web</li>
        <li>Frontend developers learning design</li>
        <li>Career changers entering design field</li>
      </ul>
    `,
    enrolledCount: 234,
    rating: 4.4,
    reviews: []
  },
  {
    title: 'Full-Stack Web Development with MERN',
    description: 'Build complete web applications using MongoDB, Express, React, and Node.js',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '4 months',
    price: 55000,
    instructor: 'Full-Stack Development Experts',
    overview: `
      <p><strong>Full-Stack Web Development with MERN</strong> teaches you to build modern web applications using the complete MERN stack.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'MongoDB Fundamentals',
        topics: ['Document Structure', 'CRUD Operations', 'Queries', 'Aggregation', 'Indexing']
      },
      {
        moduleTitle: 'Backend with Node.js & Express',
        topics: ['Server Setup', 'Routing', 'Middleware', 'Controllers', 'Error Handling']
      },
      {
        moduleTitle: 'Database Integration',
        topics: ['Mongoose ODM', 'Schema Design', 'Relationships', 'Validation', 'Performance']
      },
      {
        moduleTitle: 'Frontend with React',
        topics: ['Components', 'State Management', 'Hooks', 'API Integration', 'Routing']
      },
      {
        moduleTitle: 'Complete Application Development',
        topics: ['Authentication', 'Authorization', 'File Upload', 'Testing', 'Deployment']
      }
    ],
    prerequisites: `
      <ul>
        <li>Strong JavaScript fundamentals</li>
        <li>HTML/CSS knowledge</li>
        <li>Basic web development concepts</li>
        <li>Understanding of client-server architecture</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>Frontend developers becoming full-stack</li>
        <li>Aspiring MERN developers</li>
        <li>Entrepreneurs building MVPs</li>
        <li>Career changers entering web development</li>
      </ul>
    `,
    enrolledCount: 456,
    rating: 4.7,
    reviews: []
  },
  {
    title: 'React.js Advanced Concepts',
    description: 'Master advanced React patterns, state management, and performance optimization',
    category: 'Web Development',
    level: 'Advanced',
    duration: '3 months',
    price: 48000,
    instructor: 'React Specialists',
    overview: `
      <p><strong>React.js Advanced Concepts</strong> covers advanced React patterns, state management solutions, and optimization techniques.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Advanced React Patterns',
        topics: ['Render Props', 'Higher-Order Components', 'Custom Hooks', 'Compound Components', 'Controlled vs Uncontrolled']
      },
      {
        moduleTitle: 'State Management',
        topics: ['Redux Fundamentals', 'Actions & Reducers', 'Redux Middleware', 'Redux Toolkit', 'MobX']
      },
      {
        moduleTitle: 'Performance Optimization',
        topics: ['Code Splitting', 'Lazy Loading', 'Memoization', 'useCallback & useMemo', 'React Profiler']
      },
      {
        moduleTitle: 'Testing React Apps',
        topics: ['Unit Testing', 'Integration Testing', 'Jest', 'React Testing Library', 'E2E Testing']
      },
      {
        moduleTitle: 'Real-World Applications',
        topics: ['Server-Side Rendering', 'Static Site Generation', 'Micro Frontends', 'TypeScript with React', 'Production Deployment']
      }
    ],
    prerequisites: `
      <ul>
        <li>Intermediate React knowledge</li>
        <li>JavaScript ES6+ proficiency</li>
        <li>Understanding of component lifecycle</li>
        <li>Experience with a real React project</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>React developers advancing skills</li>
        <li>Senior frontend engineers</li>
        <li>Technical leads</li>
        <li>Enterprise React developers</li>
      </ul>
    `,
    enrolledCount: 267,
    rating: 4.7,
    reviews: []
  },
  {
    title: 'AWS Cloud Computing Essentials',
    description: 'Learn AWS fundamentals and build scalable cloud applications',
    category: 'Cloud Computing',
    level: 'Beginner',
    duration: '2.5 months',
    price: 45000,
    instructor: 'AWS Certified Professionals',
    overview: `
      <p><strong>AWS Cloud Computing Essentials</strong> is a comprehensive introduction to Amazon Web Services and cloud computing.</p>
    `,
    curriculum: [
      {
        moduleTitle: 'Cloud Computing Basics',
        topics: ['Cloud Concepts', 'Service Models', 'AWS Global Infrastructure', 'Regions & AZs', 'Cost Model']
      },
      {
        moduleTitle: 'Compute Services',
        topics: ['EC2 Instances', 'Auto Scaling', 'Load Balancing', 'Lambda', 'Elastic Beanstalk']
      },
      {
        moduleTitle: 'Storage & Database',
        topics: ['S3 Buckets', 'EBS Volumes', 'RDS', 'DynamoDB', 'ElastiCache']
      },
      {
        moduleTitle: 'Networking',
        topics: ['VPC', 'Subnets', 'Security Groups', 'NAT Gateway', 'Route 53']
      },
      {
        moduleTitle: 'Security & Monitoring',
        topics: ['IAM', 'Encryption', 'CloudWatch', 'CloudTrail', 'AWS Config']
      }
    ],
    prerequisites: `
      <ul>
        <li>Basic IT knowledge</li>
        <li>Understanding of networking concepts</li>
        <li>Familiarity with servers and applications</li>
        <li>AWS account access</li>
      </ul>
    `,
    targetAudience: `
      <ul>
        <li>System administrators</li>
        <li>Developers interested in cloud</li>
        <li>DevOps engineers</li>
        <li>IT professionals</li>
      </ul>
    `,
    enrolledCount: 389,
    rating: 4.6,
    reviews: []
  }
];

// ============================================
// MAIN SEEDER FUNCTIONS
// ============================================

const importData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing collections
    console.log('🗑️  Clearing existing data...');
    await CourseCategory.deleteMany({});
    await Course.deleteMany({});
    console.log('✅ Existing data cleared');

    // Import categories
    console.log('📂 Importing categories...');
    const importedCategories = await CourseCategory.insertMany(categories);
    console.log(`✅ ${importedCategories.length} categories imported`);

    // Map category names to their IDs
    const categoryMap = {};
    importedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Replace category names with IDs and generate slugs for courses
    const coursesWithCategoryIdsAndSlugs = coursesData.map(course => ({
      ...course,
      category: categoryMap[course.category],
      slug: course.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')    // Remove special characters
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/-+/g, '-')         // Replace multiple hyphens with single
    }));

    // Import courses
    console.log('📚 Importing courses...');
    const importedCourses = await Course.insertMany(coursesWithCategoryIdsAndSlugs);
    console.log(`✅ ${importedCourses.length} courses imported`);

    console.log('✨ Data import completed successfully!');
    console.log(`📊 Summary: ${importedCategories.length} categories, ${importedCourses.length} courses`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    console.log('🗑️  Deleting all data...');
    await CourseCategory.deleteMany({});
    await Course.deleteMany({});
    console.log('✅ All data deleted successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error destroying data:', error.message);
    process.exit(1);
  }
};

// ============================================
// CLI COMMAND EXECUTION
// ============================================

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Usage:');
  console.log('  node backend/seeder.js -i    (to import data)');
  console.log('  node backend/seeder.js -d    (to destroy data)');
  process.exit(0);
}

module.exports = { importData, destroyData };
