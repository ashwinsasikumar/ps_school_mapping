import { useEffect, useState } from "react";

const Faculty = () => {
  const [faculty, setFaculty] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacultyData() {
      try {
        // Fetch faculty profile
        const facultyRes = await fetch("/api/faculty/profile", {
          credentials: "include",
        });
        const facultyData = await facultyRes.json();
        setFaculty(facultyData);

        // Fetch mapped students
        const studentRes = await fetch("/api/faculty/students", {
          credentials: "include",
        });
        const studentData = await studentRes.json();
        setStudents(studentData);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    fetchFacultyData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Faculty Dashboard
        </h1>
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <img
              src={
                faculty?.avatar ||
                "https://ui-avatars.com/api/?name=Faculty"
              }
              alt="Faculty"
              className="w-20 h-20 rounded-full border-2 border-blue-300"
            />
            <div>
              <div className="text-xl font-semibold text-gray-900">
                {faculty?.name || "Faculty Name"}
              </div>
              <div className="text-gray-600">
                Email: {faculty?.email || "faculty@email.com"}
              </div>
              <div className="text-gray-500">
                Department: {faculty?.department || "Department"}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Mapped Students
          </h2>
          {students.length === 0 ? (
            <div className="text-gray-500 italic">
              No students mapped to you currently.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Roll Number</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr
                      key={student.id}
                      className={idx % 2 === 0 ? "bg-blue-50" : ""}
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.email}</td>
                      <td className="px-4 py-2">{student.rollNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faculty;
