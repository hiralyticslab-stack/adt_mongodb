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

    console.log("=== Part B: CRUD Operations ===");

    // 1. Find with a filter ($elemMatch: marks > 75)
    const highScorers = await students.find({
      enrolledCourses: { $elemMatch: { marks: { $gt: 75 } } }
    }).toArray();
    console.log("\n1. Students with marks > 75:", JSON.stringify(highScorers, null, 2));

    // 2. Find with $in (Students enrolled in a given list of 2 course _ids)
    const sampleCourses = await courses.find({}, { projection: { _id: 1 } }).limit(2).toArray();
    const targetCourseIds = sampleCourses.map(c => c._id);

    const enrolledStudents = await students.find({
      "enrolledCourses.courseId": { $in: targetCourseIds }
    }).toArray();
    console.log("\n2. Students enrolled in target courses:", JSON.stringify(enrolledStudents, null, 2));

    // 3. Update marks for one specific student and course using arrayFilters
    const targetStudent = await students.findOne({ email: "jahanvi@gmail.com" });
    if (targetStudent && targetStudent.enrolledCourses.length > 0) {
      const courseIdToUpdate = targetStudent.enrolledCourses[0].courseId;
      const updateRes = await students.updateOne(
        { email: "jahanvi@gmail.com" },
        { $set: { "enrolledCourses.$[elem].marks": 90 } },
        { arrayFilters: [{ "elem.courseId": courseIdToUpdate }] }
      );
      console.log("\n3. Positional array update result:", updateRes);
    }

    // 4. UpdateMany ($inc 1 bonus mark to enrollments currently below 50 marks)
    const incRes = await students.updateMany(
      { "enrolledCourses.marks": { $lt: 50 } },
      { $inc: { "enrolledCourses.$[elem].marks": 1 } },
      { arrayFilters: [{ "elem.marks": { $lt: 50 } }] }
    );
    console.log("\n4. Bonus mark updateMany result:", incRes);

    // 5. Delete single enrollment subdocument using $pull
    const studentToPull = await students.findOne({ email: "ummul@gmail.com" });
    if (studentToPull && studentToPull.enrolledCourses.length > 0) {
      const courseToRemove = studentToPull.enrolledCourses[0].courseId;
      const pullRes = await students.updateOne(
        { email: "ummul@gmail.com" },
        { $pull: { enrolledCourses: { courseId: courseToRemove } } }
      );
      console.log("\n5. Subdocument $pull result:", pullRes);
    }

  } catch (error) {
    console.error("CRUD Error:", error);
  } finally {
    await client.close();
  }
}

main();