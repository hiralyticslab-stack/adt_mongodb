require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course.js');
const Student = require('./models/Student.js');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in your .env file");

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected via Mongoose!");

    // 1. CREATE
    const newCourse = await Course.create({ title: "Cloud Computing", credits: 3 });
    const newStudent = await Student.create({
      name: "Divya Patel",
      email: "divya@gmail.com",
      profile: { skills: ["AWS", "Docker"], city: "Surat" },
      enrolledCourses: [{ courseId: newCourse._id, marks: 88 }]
    });
    console.log("Created Student:", newStudent._id);

    // 2. READ
    const fetchedStudent = await Student.findOne({ email: "divya@gmail.com" }).populate('enrolledCourses.courseId');
    console.log("Fetched Student Courses:", JSON.stringify(fetchedStudent.enrolledCourses, null, 2));

    // 3. UPDATE
    const updatedStudent = await Student.findByIdAndUpdate(
      newStudent._id,
      { $set: { "enrolledCourses.$[elem].marks": 95 } },
      {
        arrayFilters: [{ "elem.courseId": newCourse._id }],
        returnDocument: 'after', // <--- Mongoose v8+ compliant option
        runValidators: true
      }
    );
    console.log("Updated Marks:", updatedStudent.enrolledCourses);

    // 4. DELETE
    await Student.findByIdAndDelete(newStudent._id);
    await Course.findByIdAndDelete(newCourse._id);
    console.log("Cleaned up test documents successfully.");

    // 5. VALIDATION DEMO
    console.log("\n--- Validation Demo ---");
    try {
      const invalidStudent = new Student({ email: "missing.name@example.com" });
      await invalidStudent.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        console.log("Caught Mongoose ValidationError successfully:");
        console.log(">", err.message);
      } else {
        throw err;
      }
    }

  } catch (error) {
    console.error("Mongoose Script Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected Mongoose.");
  }
}

main();