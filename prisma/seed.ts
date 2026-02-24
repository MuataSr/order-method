import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const instructorPassword = await bcrypt.hash('instructor123', 12);
  const studentPassword = await bcrypt.hash('student123', 12);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@lms.com' },
    update: {},
    create: {
      email: 'instructor@lms.com',
      name: 'Dr. Sarah Johnson',
      password: instructorPassword,
      role: 'INSTRUCTOR',
      bio: 'Expert in web development and computer science with 10+ years of teaching experience.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      email: 'student@lms.com',
      name: 'Alex Chen',
      password: studentPassword,
      role: 'STUDENT',
      bio: 'Aspiring full-stack developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  console.log('Created users:');
  console.log('  - Admin: admin@lms.com / admin123');
  console.log('  - Instructor: instructor@lms.com / instructor123');
  console.log('  - Student: student@lms.com / student123');

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course. Build real-world projects and become a full-stack developer.',
      thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&q=80',
      category: 'Web Development',
      level: 'BEGINNER',
      duration: 2400, // 40 hours
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced React & Next.js Masterclass',
      description: 'Master React hooks, state management, server components, and build production-ready applications with Next.js 14.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      category: 'Frontend',
      level: 'ADVANCED',
      duration: 1200, // 20 hours
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Python for Data Science',
      description: 'Learn Python programming, data analysis with Pandas, visualization with Matplotlib, and machine learning basics.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
      category: 'Data Science',
      level: 'INTERMEDIATE',
      duration: 1800, // 30 hours
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'UI/UX Design Fundamentals',
      description: 'Learn design principles, user research, wireframing, prototyping, and create beautiful user interfaces.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      category: 'Design',
      level: 'BEGINNER',
      duration: 900, // 15 hours
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  console.log('Created courses');

  // Create modules and lessons for course 1
  const module1 = await prisma.module.create({
    data: {
      title: 'Getting Started with Web Development',
      description: 'Introduction to web technologies and setting up your development environment.',
      order: 1,
      courseId: course1.id,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      title: 'HTML Fundamentals',
      description: 'Learn the building blocks of web pages.',
      order: 2,
      courseId: course1.id,
    },
  });

  const module3 = await prisma.module.create({
    data: {
      title: 'CSS Styling & Layout',
      description: 'Master CSS and create beautiful layouts.',
      order: 3,
      courseId: course1.id,
    },
  });

  // Lessons for module 1
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Welcome to the Course',
        description: 'Introduction and course overview',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 10,
        order: 1,
        isFree: true,
        moduleId: module1.id,
      },
      {
        title: 'Setting Up Your Environment',
        description: 'Install VS Code, Node.js, and essential extensions',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 25,
        order: 2,
        isFree: true,
        moduleId: module1.id,
      },
      {
        title: 'How the Web Works',
        description: 'Understanding client-server architecture',
        type: 'TEXT',
        content: `# How the Web Works

The World Wide Web operates on a **client-server model**. Here's how it works:

## Client-Server Architecture

1. **Client**: Your web browser (Chrome, Firefox, Safari)
2. **Server**: Computers that store websites and serve content

## The Process

1. You type a URL in your browser
2. Browser sends a **HTTP request** to the server
3. Server processes the request
4. Server sends back an **HTTP response** with HTML, CSS, and JavaScript
5. Browser renders the content

## Key Concepts

- **DNS**: Translates domain names to IP addresses
- **HTTP/HTTPS**: Protocol for transferring data
- **SSL/TLS**: Encrypts data for security

## Next Steps

In the next lesson, we'll set up our development environment!`,
        duration: 15,
        order: 3,
        moduleId: module1.id,
      },
    ],
  });

  // Lessons for module 2
  await prisma.lesson.createMany({
    data: [
      {
        title: 'HTML Basics',
        description: 'Learn HTML structure and common tags',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 30,
        order: 1,
        moduleId: module2.id,
      },
      {
        title: 'HTML Forms & Inputs',
        description: 'Create interactive forms',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 25,
        order: 2,
        moduleId: module2.id,
      },
      {
        title: 'HTML Knowledge Check',
        description: 'Test your HTML knowledge',
        type: 'QUIZ',
        content: 'Quiz on HTML fundamentals',
        duration: 10,
        order: 3,
        moduleId: module2.id,
      },
    ],
  });

  // Lessons for module 3
  await prisma.lesson.createMany({
    data: [
      {
        title: 'CSS Selectors & Properties',
        description: 'Learn how to select and style elements',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 35,
        order: 1,
        moduleId: module3.id,
      },
      {
        title: 'Flexbox Layout',
        description: 'Master modern CSS layouts',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 40,
        order: 2,
        moduleId: module3.id,
      },
      {
        title: 'CSS Grid Deep Dive',
        description: 'Create complex layouts with Grid',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 45,
        order: 3,
        moduleId: module3.id,
      },
    ],
  });

  console.log('Created modules and lessons');

  // Create quiz for the HTML lesson
  const quizLesson = await prisma.lesson.findFirst({
    where: { title: 'HTML Knowledge Check' },
  });

  if (quizLesson) {
    const quiz = await prisma.quiz.create({
      data: {
        title: 'HTML Fundamentals Quiz',
        description: 'Test your knowledge of HTML basics',
        passingScore: 70,
        maxAttempts: 3,
        timeLimit: 10,
        lessonId: quizLesson.id,
      },
    });

    await prisma.quizQuestion.createMany({
      data: [
        {
          question: 'What does HTML stand for?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Markup Language',
            'Home Tool Markup Language',
          ]),
          correctAnswer: '0',
          explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for web pages.',
          points: 1,
          order: 1,
          quizId: quiz.id,
        },
        {
          question: 'Which tag is used for the largest heading?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify(['<h6>', '<heading>', '<h1>', '<head>']),
          correctAnswer: '2',
          explanation: 'The <h1> tag defines the largest and most important heading.',
          points: 1,
          order: 2,
          quizId: quiz.id,
        },
        {
          question: 'What is the correct HTML element for inserting a line break?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify(['<break>', '<lb>', '<br>', '<newline>']),
          correctAnswer: '2',
          explanation: 'The <br> tag inserts a single line break.',
          points: 1,
          order: 3,
          quizId: quiz.id,
        },
        {
          question: 'HTML comments start with <!-- and end with -->',
          type: 'TRUE_FALSE',
          options: JSON.stringify(['True', 'False']),
          correctAnswer: 'True',
          explanation: 'Correct! HTML comments are written between <!-- and --> tags.',
          points: 1,
          order: 4,
          quizId: quiz.id,
        },
        {
          question: 'Which attribute specifies an alternate text for an image?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify(['src', 'alt', 'title', 'href']),
          correctAnswer: '1',
          explanation: 'The alt attribute provides alternative text for an image if it cannot be displayed.',
          points: 1,
          order: 5,
          quizId: quiz.id,
        },
      ],
    });

    console.log('Created quiz with questions');
  }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 15,
    },
  });

  console.log('Created enrollment');

  // Create some lesson progress
  const lessons = await prisma.lesson.findMany({
    where: { moduleId: { in: [module1.id] } },
    take: 2,
  });

  for (const lesson of lessons) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  console.log('Created lesson progress');

  // Create announcement
  await prisma.announcement.create({
    data: {
      title: 'Welcome to the Course!',
      content: 'Welcome to the Complete Web Development Bootcamp! Make sure to introduce yourself in the discussion forum and check out the course materials.',
      priority: 'HIGH',
      courseId: course1.id,
      authorId: instructor.id,
    },
  });

  console.log('Created announcement');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
