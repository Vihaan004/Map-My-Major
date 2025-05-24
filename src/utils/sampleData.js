// Sample data for a CS/Software Engineering major map
export const sampleCSMap = {
  name: "Computer Science Major",
  requirements: [
    { name: 'Humanities', tag: 'HU' },
    { name: 'Social & Behavioral Sciences', tag: 'SB' },
    { name: 'Natural Sciences', tag: 'SQ' },
    { name: 'Literacy', tag: 'L' },
    { name: 'Cultural Diversity', tag: 'C' },
    { name: 'Global Awareness', tag: 'G' },
    { name: 'Historical Awareness', tag: 'H' },
    { name: 'Computer Science', tag: 'CS' }
  ],
  semesters: [
    // Semester 1 - Fall
    [
      { name: "CSE 110", title: "Principles of Programming", credits: 3, requirements: ["CS"], prerequisites: [] },
      { name: "MAT 265", title: "Calculus for Engineers I", credits: 3, requirements: [], prerequisites: [] },
      { name: "ASU 101", title: "The ASU Experience", credits: 1, requirements: [], prerequisites: [] },
      { name: "GCU 121", title: "Geography", credits: 4, requirements: ["SB", "G"], prerequisites: [] },
      { name: "ENG 107", title: "First-Year Composition", credits: 3, requirements: [], prerequisites: [] },
      { name: "FSE 100", title: "Introduction to Engineering", credits: 2, requirements: [], prerequisites: [] }
    ],
    // Semester 2 - Spring
    [
      { name: "CSE 120", title: "Digital Design Fundamentals", credits: 3, requirements: ["CS"], prerequisites: ["CSE 110"] },
      { name: "CSE 205", title: "Object-Oriented Programming", credits: 3, requirements: [], prerequisites: ["CSE 110"] },
      { name: "MAT 266", title: "Calculus for Engineers II", credits: 3, requirements: [], prerequisites: ["MAT 265"] },
      { name: "CHM 114", title: "Chemistry for Engineers", credits: 4, requirements: ["SQ"], prerequisites: [] },
      { name: "ENG 108", title: "First-Year Composition", credits: 3, requirements: [], prerequisites: ["ENG 107"] },
      { name: "ASB 222", title: "Buried Cities and Lost Tribes", credits: 3, requirements: ["SB", "G", "H"], prerequisites: [] }
    ],
    // Semester 3 - Fall
    [
      { name: "CSE 230", title: "Computer Organization and Assembly", credits: 3, requirements: ["CS"], prerequisites: ["CSE 120"] },
      { name: "CSE 220", title: "Programming for CS", credits: 3, requirements: [], prerequisites: ["CSE 205"] },
      { name: "MAT 267", title: "Calculus for Engineers III", credits: 3, requirements: [], prerequisites: ["MAT 266"] },
      { name: "MAT 243", title: "Discrete Math Structures", credits: 3, requirements: [], prerequisites: [] },
      { name: "PHY 121", title: "University Physics I", credits: 4, requirements: ["SQ"], prerequisites: ["MAT 265"] },
      { name: "HON 171", title: "The Human Event", credits: 3, requirements: ["HU", "L"], prerequisites: [] }
    ],
    // Semester 4 - Spring
    [
      { name: "CSE 360", title: "Intro to Software Engineering", credits: 3, requirements: [], prerequisites: ["CSE 220"] },
      { name: "CSE 310", title: "Data Structures & Algorithms", credits: 3, requirements: [], prerequisites: ["CSE 220", "MAT 243"] },
      { name: "MAT 275", title: "Differential Equations", credits: 3, requirements: [], prerequisites: ["MAT 267"] },
      { name: "FSE 104", title: "EPICS Gold I", credits: 1, requirements: [], prerequisites: [] },
      { name: "PHY 131", title: "University Physics II", credits: 4, requirements: ["SQ"], prerequisites: ["PHY 121"] },
      { name: "HON 272", title: "The Human Event", credits: 3, requirements: ["HU", "H", "L"], prerequisites: ["HON 171"] },
      { name: "CSE 301", title: "Computing Ethics", credits: 1, requirements: [], prerequisites: [] }
    ],
    // Semester 5 - Fall
    [
      { name: "CSE 330", title: "Operating Systems", credits: 3, requirements: ["CS"], prerequisites: ["CSE 310"] },
      { name: "EEE 202", title: "Circuits I", credits: 4, requirements: [], prerequisites: ["PHY 131"] },
      { name: "CSE 320", title: "Design & Synthesis of Digital Systems", credits: 3, requirements: [], prerequisites: ["CSE 230"] },
      { name: "IEE 380", title: "Probability & Stats for Engineering", credits: 3, requirements: [], prerequisites: ["MAT 267"] },
      { name: "MUS 362", title: "Beatles After the Beatles", credits: 3, requirements: ["HU", "C"], prerequisites: [] }
    ],
    // Semester 6 - Spring
    [
      { name: "CSE 434", title: "Computer Networks", credits: 3, requirements: [], prerequisites: ["CSE 330"] },
      { name: "CSE 325", title: "Embedded Microprocessor Systems", credits: 3, requirements: [], prerequisites: ["CSE 230"] },
      { name: "EEE 334", title: "Circuits II", credits: 4, requirements: [], prerequisites: ["EEE 202"] },
      { name: "MAT 343", title: "Applied Linear Algebra", credits: 3, requirements: [], prerequisites: ["MAT 267"] },
      { name: "CSE 445", title: "Distributed Software Development", credits: 3, requirements: ["L"], prerequisites: ["CSE 360"] }
    ],
    // Semester 7 - Fall
    [
      { name: "CSE 423", title: "Capstone I", credits: 3, requirements: ["L"], prerequisites: ["CSE 310", "CSE 360"] },
      { name: "HON 492", title: "Honors Thesis I", credits: 3, requirements: [], prerequisites: [] },
      { name: "CSE 420", title: "Computer Architecture I", credits: 3, requirements: [], prerequisites: ["CSE 330"] },
      { name: "CSE 475", title: "Foundations of Machine Learning", credits: 3, requirements: ["L"], prerequisites: ["CSE 310", "IEE 380"] },
      { name: "FSE 301", title: "Entrepreneurship & Value Creation", credits: 3, requirements: ["L"], prerequisites: [] }
    ],
    // Semester 8 - Spring
    [
      { name: "CSE 424", title: "Capstone II", credits: 3, requirements: ["L"], prerequisites: ["CSE 423"] },
      { name: "HON 493", title: "Honors Thesis II", credits: 3, requirements: ["L"], prerequisites: ["HON 492"] },
      { name: "ELECTIVE", title: "Technical Elective", credits: 3, requirements: ["L"], prerequisites: [] }
    ]
  ]
};
