require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define MONGODB_URI in your .env file");

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db("campus_enrollment_mh");
    const courses = db.collection("courses");
    const students = db.collection("students");

    const targetCourse = await courses.findOne({ title: "Database Management Systems" });
    const student1 = await students.findOne({ email: "jahanvi@gmail.com" });
    const student2 = await students.findOne({ email: "hiral@gmail.com" });

    if (targetCourse && student1 && student2) {
      const reviewRes = await courses.updateOne(
        { _id: targetCourse._id },
        {
          $set: {
            reviews: [
              {
                studentId: student1._id,
                rating: 5,
                comment: "Excellent practical experience with MongoDB!",
                createdAt: new Date()
              },
              {
                studentId: student2._id,
                rating: 4,
                comment: "Very clear explanation of document modeling.",
                createdAt: new Date()
              }
            ]
          }
        }
      );
      console.log("Reviews added to course successfully:", reviewRes);
    }
  } catch (error) {
    console.error("Reviews Error:", error);
  } finally {
    await client.close();
  }
}

main();