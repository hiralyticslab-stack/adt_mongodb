```markdown
# Campus Course Enrollment System — MongoDB & Mongoose (Unit 3)

A MongoDB-backed course enrollment system built for Unit 3 Practical Assignment[cite: 1]. This project models students, courses, and course enrollments as document structures in MongoDB Atlas, showcasing CRUD operations, indexing, data modeling choices (embedding vs. referencing), and Mongoose ODM integration[cite: 1].

---

## 🌐 Database & Cluster Configuration

- **Database Name:** `campus_enrollment_mh`
- **Cluster Tier:** MongoDB Atlas M0 Free Tier[cite: 1]
- **Region / Provider:** AWS / `ap-south-1` (Mumbai)
- **Deployment Endpoint:** `clustermd.kuiomsq.mongodb.net`

---

## 📋 Prerequisites & Installation

### 1. Prerequisites (What You Need Installed)
Before running this project, ensure the following software is installed on your system:
- **Node.js** (v18 or higher) — Includes `npm` package manager.
- **MongoDB Shell (`mongosh`)** *(Optional, for standalone query checks)*.
- **Git** *(For version control)*.

### 2. Environment Setup & Dependencies Installation

1. Open your terminal in the project directory (`D:\mongo_adt`).
2. Install project dependencies:
   ```bash
   npm install

```

*Installed dependencies include:*

* `dotenv`: For managing sensitive environment variables.


* `mongodb`: Official Node.js driver for raw MongoDB operations.
* `mongoose`: ODM library for schema validation and modeling.



3. Create environment configuration files:
* Create a `.env` file in the root directory for your live connection:


```env
MONGODB_URI=mongodb+srv://<username>:<password>@clustermd.kuiomsq.mongodb.net/campus_enrollment_mh?retryWrites=true&w=majority

```


* Verify that `.env.example` exists for submission (credentials excluded):


```env
MONGODB_URI=mongodb+srv://<username>:<password>@clustermd.kuiomsq.mongodb.net/campus_enrollment_mh?retryWrites=true&w=majority

```





---

## 📁 Project Structure

```text
mongo_adt/
├── .env                    # Live connection string (Excluded from Git/Submission)
├── .env.example            # Environment template (Included in submission)
├── .gitignore              # Specifies intentionally untracked files
├── package.json            # NPM dependencies & execution scripts
├── README.md               # Project setup and documentation
├── part_a_setup.js         # Atlas setup & document population script
├── part_b_crud.js          # Raw MongoDB CRUD query operations ($elemMatch, $in, $set, $inc, $pull)
├── part_c_indexing.js      # Unique & array indexes with explain() execution analysis
├── part_d_reviews.js       # Embedded course review implementation
├── part_d_modeling.md      # Justification write-up for embedding vs. referencing
├── crud.js                 # Complete Mongoose ODM workflow & validation error handling
└── models/
    ├── Course.js           # Mongoose Course schema definition
    └── Student.js          # Mongoose Student schema definition

```

---

## 🚀 Execution Guide

You can run each part of the assignment using standard `npm` commands:

### **Part A: Setup & Data Population**

Populates the `courses` and `students` collections with initial sample data, references, and flexible profiles.

```bash
npm run setup

```

### **Part B: CRUD Operations**

Executes filter queries (`$elemMatch`, `$in`), positional array updates (`$set`, `$inc`), and array subdocument removal (`$pull`).

```bash
npm run crud

```

### **Part C: Indexing & Performance Analysis**

Creates unique and single-field array indexes and outputs `explain("executionStats")` to verify stage transition from `COLLSCAN` to `IXSCAN`.

```bash
npm run indexing

```

### **Part D: Course Reviews Implementation**

Applies embedded review subdocuments to course documents.

```bash
npm run reviews

```

### **Part E: Mongoose ODM Workflow & Validation**

Runs the full Mongoose lifecycle (Create, Read with `.populate()`, Update with `returnDocument: 'after'`, Delete) and catches schema validation errors gracefully.

```bash
npm run mongoose

```

---

## 🛠️ Issues Encountered & Solutions

1. **PowerShell Script Execution Restrictions:**
* *Issue:* Running `npm` commands produced a `PSSecurityException` error regarding execution policies.
* *Resolution:* Adjusted policy for the current user using `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.


2. **ES Module / CommonJS Compatibility:**
* *Issue:* Using `import` statements caused `SyntaxError: Cannot use import statement outside a module`.
* *Resolution:* Added `"type": "module"` to `package.json` to enable native ES module support across all `.js` files.


3. **Array Updates Without Overwriting Documents:**
* *Issue:* Updating nested array elements threatened to overwrite entire array fields.


* *Resolution:* Implemented `arrayFilters` combined with positional identifiers (`enrolledCourses.$[elem].marks`) for target field updates.


4. **Mongoose v8+ Deprecation Warning:**
* *Issue:* Received a deprecation warning regarding `{ new: true }` in `findByIdAndUpdate`.
* *Resolution:* Updated query options to use `{ returnDocument: 'after' }`.



```

```