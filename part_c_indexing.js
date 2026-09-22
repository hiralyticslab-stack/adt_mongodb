require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define MONGODB_URI in your .env file");

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db("campus_enrollment_mh");
    const students = db.collection("students");
    const courses = db.collection("courses");

    console.log("=== Part C: Indexing ===");

    // 1. Unique index on email
    const emailIndex = await students.createIndex({ email: 1 }, { unique: true });
    console.log("Created Unique Index on Email:", emailIndex);

    // 2. Index on enrolledCourses.courseId
    const courseIdIndex = await students.createIndex({ "enrolledCourses.courseId": 1 });
    console.log("Created Index on enrolledCourses.courseId:", courseIdIndex);

    // 3. Explain Execution Plan Check
    const sampleCourse = await courses.findOne({});
    if (sampleCourse) {
      const explainResult = await students.find({
        "enrolledCourses.courseId": sampleCourse._id
      }).explain("executionStats");

      console.log("\n--- Explain Execution Stats ---");
      console.log("Winning Plan Stage:", explainResult.queryPlanner.winningPlan.stage);
      console.log("Total Docs Examined:", explainResult.executionStats.totalDocsExamined);
    }

  } catch (error) {
    console.error("Indexing Error:", error);
  } finally {
    await client.close();
  }
}

main();