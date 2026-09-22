import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define MONGODB_URI in your .env file");

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("campus_enrollment_mh");
    const coursesCollection = db.collection("courses");
    const studentsCollection = db.collection("students");

    // Clear existing data for clean setup
    await coursesCollection.deleteMany({});
    await studentsCollection.deleteMany({});

    // 1. Insert Courses
    const courseResult = await coursesCollection.insertMany([
      { title: "Database Management Systems", credits: 4 },
      { title: "Web Development", credits: 3 },
      { title: "Data Structures", credits: 4 }
    ]);
    
    console.log("Courses inserted:", courseResult.insertedIds);

    const dbmsId = courseResult.insertedIds[0];
    const webDevId = courseResult.insertedIds[1];
    const dataStructuresId = courseResult.insertedIds[2];

    // 2. Insert Students with flexible profiles and enrollment references
    const studentResult = await studentsCollection.insertMany([
      {
        name: "Jahanvi",
        email: "jahanvi@gmail.com",
        profile: { skills: ["JavaScript", "MongoDB"], city: "Surat" },
        enrolledCourses: [
          { courseId: dbmsId, marks: 85 },
          { courseId: webDevId, marks: 72 }
        ]
      },
      {
        name: "Hiral",
        email: "hiral@gmail.com",
        profile: { skills: ["Python", "Java"], github: "github.com/hiral" },
        enrolledCourses: [
          { courseId: dbmsId, marks: 68 },
          { courseId: dataStructuresId, marks: 91 }
        ]
      },
      {
        name: "Ummul",
        email: "ummul@gmail.com",
        profile: { skills: ["C++", "Data Structures"], city: "Ahmedabad", linkedin: "linkedin.com/in/ummul" },
        enrolledCourses: [
          { courseId: webDevId, marks: 48 },
          { courseId: dataStructuresId, marks: null } // Explicit null
        ]
      },
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        profile: { skills: ["React", "Node.js"], city: "Mumbai" },
        enrolledCourses: [
          { courseId: dbmsId, marks: 78 }
        ]
      },
      {
        name: "Priya",
        email: "priya@gmail.com",
        profile: { skills: ["MongoDB", "Express"], github: "github.com/priya", city: "Vadodara" },
        enrolledCourses: [
          { courseId: webDevId, marks: 88 }
        ]
      }
    ]);

    console.log("Students inserted successfully:", studentResult.insertedIds);
    console.log("\nPart A setup completed.");
  } catch (error) {
    console.error("Error setting up data:", error);
  } finally {
    await client.close();
  }
}

main();