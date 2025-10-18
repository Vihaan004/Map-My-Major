'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface Map {
  id: string;
  map_name: string;
  start_term: string;
  start_year: number;
  track_total_credits: number;
  status: string;
}

interface Semester {
  id: string;
  map_id: string;
  term: string;
  year: number;
  index: number;
}

interface Class {
  id: string;
  map_id: string;
  semester_id: string;
  index: number;
  course_id: string | null;
  class_code: string;
  class_subject: string;
  class_number: string;
  class_name: string;
  class_credits: number;
  class_requirement_tags: string[] | null;
  status: string;
  grade: string | null;
}

interface Course {
  id: string;
  course_code: string;
  subject: string;
  number: string;
  name: string;
  credit_hours: number;
  requirement_tags: string[] | null;
}

interface Requirement {
  id: string;
  name: string;
  tag: string;
  category: string | null;
  type: string;
  is_custom: boolean;
}

interface MapClientProps {
  user: User;
  map: Map;
  initialSemesters: Semester[];
  initialClasses: Class[];
  allCourses: Course[];
  allRequirements: Requirement[];
}

export default function MapClient({ 
  user, 
  map, 
  initialSemesters, 
  initialClasses, 
  allCourses, 
  allRequirements 
}: MapClientProps) {
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  
  // Modal states
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  
  // Search state for add class modal
  const [courseSearch, setCourseSearch] = useState('');
  
  // New semester data
  const [newSemester, setNewSemester] = useState({
    term: 'FALL',
    year: new Date().getFullYear(),
  });

  // New requirement data
  const [newRequirement, setNewRequirement] = useState({
    name: '',
    tag: '',
    category: '',
    type: 'CREDIT_HOURS',
  });

  // Calculate requirement progress
  const calculateRequirementProgress = (req: Requirement) => {
    let current = 0;
    classes.forEach(cls => {
      if (cls.class_requirement_tags && cls.class_requirement_tags.includes(req.tag)) {
        if (req.type === 'CREDIT_HOURS') {
          current += cls.class_credits;
        } else {
          current += 1;
        }
      }
    });
    return current;
  };

  // Add semester
  const handleAddSemester = async () => {
    try {
      const response = await fetch(`/api/maps/${map.id}/semesters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSemester,
          index: semesters.length, // Add index based on current number of semesters
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSemesters([...semesters, data.semester]);
        setShowAddSemesterModal(false);
        setNewSemester({
          term: 'FALL',
          year: new Date().getFullYear(),
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add semester');
      }
    } catch (error) {
      alert('Failed to add semester');
    }
  };

  // Add class from course
  const handleAddClass = async (course: Course) => {
    if (!selectedSemester) return;

    // Get current number of classes in this semester for index
    const semesterClasses = getClassesForSemester(selectedSemester);

    try {
      const response = await fetch(`/api/maps/${map.id}/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester_id: selectedSemester,
          course_id: course.id,
          class_code: course.course_code,
          class_subject: course.subject,
          class_number: course.number,
          class_name: course.name,
          class_credits: course.credit_hours,
          class_requirement_tags: course.requirement_tags || [],
          index: semesterClasses.length,
          status: 'PLANNED',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setClasses([...classes, data.class]);
        setShowAddClassModal(false);
        setCourseSearch('');
        setSelectedSemester(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add class');
      }
    } catch (error) {
      alert('Failed to add class');
    }
  };

  // Delete class
  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Delete this class?')) return;

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClasses(classes.filter(c => c.id !== classId));
      } else {
        alert('Failed to delete class');
      }
    } catch (error) {
      alert('Failed to delete class');
    }
  };

  // Update class status
  const handleUpdateClassStatus = async (classId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setClasses(classes.map(c => 
          c.id === classId ? { ...c, status: newStatus } : c
        ));
      } else {
        alert('Failed to update class');
      }
    } catch (error) {
      alert('Failed to update class');
    }
  };

  // Add custom requirement
  const handleAddRequirement = async () => {
    if (!newRequirement.name || !newRequirement.tag) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequirement),
      });

      if (response.ok) {
        router.refresh();
        setShowAddRequirementModal(false);
        setNewRequirement({ name: '', tag: '', category: '', type: 'CREDIT_HOURS' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add requirement');
      }
    } catch (error) {
      alert('Failed to add requirement');
    }
  };

  // Delete semester
  const handleDeleteSemester = async (semesterId: string) => {
    const semesterClasses = classes.filter(c => c.semester_id === semesterId);
    if (semesterClasses.length > 0) {
      if (!confirm(`This semester has ${semesterClasses.length} class(es). Delete anyway?`)) {
        return;
      }
    }

    try {
      const response = await fetch(`/api/semesters/${semesterId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSemesters(semesters.filter(s => s.id !== semesterId));
        setClasses(classes.filter(c => c.semester_id !== semesterId));
      } else {
        alert('Failed to delete semester');
      }
    } catch (error) {
      alert('Failed to delete semester');
    }
  };

  // Filter courses for search
  const filteredCourses = allCourses.filter(course => {
    const search = courseSearch.toLowerCase();
    return (
      course.course_code.toLowerCase().includes(search) ||
      course.name.toLowerCase().includes(search) ||
      (course.requirement_tags && course.requirement_tags.some(tag => tag.toLowerCase().includes(search)))
    );
  });

  // Get classes for a semester
  const getClassesForSemester = (semesterId: string) => {
    return classes.filter(c => c.semester_id === semesterId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-base font-semibold text-black hover:underline">
                MapMyMajor
              </Link>
              <span className="text-xs text-gray-400">›</span>
              <span className="text-sm text-gray-600">{map.map_name}</span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>
              <Link href="/courses" className="text-gray-600 hover:text-black">Course Bank</Link>
              <span className="text-gray-500">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-3rem)]">
        {/* Left Sidebar - Requirements Tracker */}
        <div className="w-64 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-black">Requirements</h3>
              <button
                onClick={() => setShowAddRequirementModal(true)}
                className="text-[10px] px-2 py-1 bg-black text-white hover:bg-gray-800"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2">
              {allRequirements.length === 0 ? (
                <p className="text-[11px] text-gray-500">No requirements yet</p>
              ) : (
                allRequirements.map(req => {
                  const current = calculateRequirementProgress(req);
                  const isComplete = current > 0;
                  
                  return (
                    <div key={req.id} className="border border-gray-200 p-2">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <div className="text-[11px] font-semibold text-black">{req.name}</div>
                          <div className="text-[10px] text-gray-500">{req.tag}</div>
                        </div>
                        <div className={`text-[10px] px-1 py-0.5 ${isComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {current} {req.type === 'CREDIT_HOURS' ? 'hrs' : 'cls'}
                        </div>
                      </div>
                      {req.category && (
                        <div className="text-[10px] text-gray-500">{req.category}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Semester Columns */}
        <div className="flex-1 overflow-x-auto">
          <div className="p-4">
            <div className="flex gap-4 min-w-max">
              {semesters.map(semester => (
                <div key={semester.id} className="w-64 flex-shrink-0">
                  <div className="border border-gray-300 h-full flex flex-col">
                    {/* Semester Header */}
                    <div className="bg-gray-50 p-2 border-b border-gray-300">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-semibold text-black">
                          {semester.term} {semester.year}
                        </h4>
                        <button
                          onClick={() => handleDeleteSemester(semester.id)}
                          className="text-[10px] text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {getClassesForSemester(semester.id).reduce((sum, c) => sum + c.class_credits, 0)} credits
                      </div>
                    </div>

                    {/* Classes List */}
                    <div className="flex-1 p-2 space-y-2 min-h-[200px]">
                      {getClassesForSemester(semester.id).map(cls => (
                        <div key={cls.id} className="border border-gray-200 p-2 hover:border-black transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1">
                              <div className="text-[11px] font-semibold text-black">{cls.class_code}</div>
                              <div className="text-[10px] text-gray-600 line-clamp-2">{cls.class_name}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteClass(cls.id)}
                              className="text-[10px] text-gray-400 hover:text-red-600 ml-1"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500">{cls.class_credits} hrs</span>
                            <select
                              value={cls.status}
                              onChange={(e) => handleUpdateClassStatus(cls.id, e.target.value)}
                              className="text-[9px] border border-gray-200 px-1 py-0.5"
                            >
                              <option value="PLANNED">Planned</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="DROPPED">Dropped</option>
                            </select>
                          </div>
                          {cls.class_requirement_tags && cls.class_requirement_tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {cls.class_requirement_tags.map(tag => (
                                <span key={tag} className="text-[9px] bg-gray-100 text-gray-700 px-1 py-0.5">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Class Button */}
                    <div className="p-2 border-t border-gray-300">
                      <button
                        onClick={() => {
                          setSelectedSemester(semester.id);
                          setShowAddClassModal(true);
                        }}
                        className="w-full py-1 text-[11px] border border-gray-300 hover:border-black hover:bg-gray-50"
                      >
                        + Add Class
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Semester Column */}
              <div className="w-64 flex-shrink-0">
                <button
                  onClick={() => setShowAddSemesterModal(true)}
                  className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-black flex items-center justify-center text-sm text-gray-500 hover:text-black"
                >
                  + Add Semester
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Semester Modal */}
      {showAddSemesterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-base font-semibold text-black mb-4">Add Semester</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Term</label>
                <select
                  value={newSemester.term}
                  onChange={(e) => setNewSemester({ ...newSemester, term: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                >
                  <option value="FALL">Fall</option>
                  <option value="SPRING">Spring</option>
                  <option value="SUMMER">Summer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={newSemester.year}
                  onChange={(e) => setNewSemester({ ...newSemester, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddSemester}
                className="flex-1 px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
              >
                Add Semester
              </button>
              <button
                onClick={() => setShowAddSemesterModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 hover:border-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full p-6 max-h-[80vh] flex flex-col">
            <h3 className="text-base font-semibold text-black mb-4">Add Class from Course Bank</h3>
            
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search by code, name, or tag..."
              className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black mb-4"
            />

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {filteredCourses.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No courses found</p>
              ) : (
                filteredCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => handleAddClass(course)}
                    className="border border-gray-200 p-3 hover:border-black cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-sm font-semibold text-black">{course.course_code}</div>
                        <div className="text-xs text-gray-600">{course.name}</div>
                      </div>
                      <span className="text-xs text-gray-500">{course.credit_hours} hrs</span>
                    </div>
                    {course.requirement_tags && course.requirement_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.requirement_tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 text-gray-700 px-1 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setShowAddClassModal(false);
                setCourseSearch('');
              }}
              className="w-full px-4 py-2 text-sm border border-gray-300 hover:border-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Requirement Modal */}
      {showAddRequirementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-base font-semibold text-black mb-4">Add Custom Requirement</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newRequirement.name}
                  onChange={(e) => setNewRequirement({ ...newRequirement, name: e.target.value })}
                  placeholder="e.g., Humanities and Arts"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Tag * (matches course tags)</label>
                <input
                  type="text"
                  value={newRequirement.tag}
                  onChange={(e) => setNewRequirement({ ...newRequirement, tag: e.target.value.toUpperCase() })}
                  placeholder="e.g., HUAD"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newRequirement.category}
                  onChange={(e) => setNewRequirement({ ...newRequirement, category: e.target.value })}
                  placeholder="e.g., General Studies"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Type *</label>
                <select
                  value={newRequirement.type}
                  onChange={(e) => setNewRequirement({ ...newRequirement, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                >
                  <option value="CREDIT_HOURS">Credit Hours</option>
                  <option value="CLASS_COUNT">Class Count</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddRequirement}
                className="flex-1 px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
              >
                Add Requirement
              </button>
              <button
                onClick={() => {
                  setShowAddRequirementModal(false);
                  setNewRequirement({ name: '', tag: '', category: '', type: 'CREDIT_HOURS' });
                }}
                className="px-4 py-2 text-sm border border-gray-300 hover:border-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
