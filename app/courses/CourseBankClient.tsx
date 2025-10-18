'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface Course {
  id: string;
  course_code: string;
  subject: string;
  number: string;
  name: string;
  description: string | null;
  credit_hours: number;
  prerequisites: string[] | null;
  corequisites: string[] | null;
  requirement_tags: string[] | null;
}

interface Requirement {
  id: string;
  name: string;
  tag: string;
  category: string | null;
  type: string;
}

interface CourseBankClientProps {
  user: User;
  courses: Course[];
  requirements: Requirement[];
}

export default function CourseBankClient({ user, courses: initialCourses, requirements }: CourseBankClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [courseForm, setCourseForm] = useState({
    course_code: '',
    subject: '',
    number: '',
    name: '',
    description: '',
    credit_hours: 3,
    prerequisites: [] as string[],
    corequisites: [] as string[],
    requirement_tags: [] as string[],
  });

  const resetForm = () => {
    setCourseForm({
      course_code: '',
      subject: '',
      number: '',
      name: '',
      description: '',
      credit_hours: 3,
      prerequisites: [],
      corequisites: [],
      requirement_tags: [],
    });
    setEditingCourse(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddCourseModal(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      course_code: course.course_code,
      subject: course.subject,
      number: course.number,
      name: course.name,
      description: course.description || '',
      credit_hours: course.credit_hours,
      prerequisites: course.prerequisites || [],
      corequisites: course.corequisites || [],
      requirement_tags: course.requirement_tags || [],
    });
    setShowAddCourseModal(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.course_code || !courseForm.name) {
      alert('Please fill in required fields (course code and name)');
      return;
    }

    // Auto-generate course_code from subject and number if both are provided
    if (courseForm.subject && courseForm.number && !courseForm.course_code) {
      courseForm.course_code = `${courseForm.subject}${courseForm.number}`;
    }

    setCreating(true);
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingCourse) {
          // Update existing course in list
          setCourses(courses.map(c => c.id === editingCourse.id ? data.course : c));
        } else {
          // Add new course to list
          setCourses([...courses, data.course]);
        }
        setShowAddCourseModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || `Failed to ${editingCourse ? 'update' : 'create'} course`);
      }
    } catch (error) {
      alert(`Failed to ${editingCourse ? 'update' : 'create'} course`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) {
      return;
    }

    setDeleting(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseId));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete course');
      }
    } catch (error) {
      alert('Failed to delete course');
    } finally {
      setDeleting(null);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !courseForm.requirement_tags.includes(tag)) {
      setCourseForm({
        ...courseForm,
        requirement_tags: [...courseForm.requirement_tags, tag.toUpperCase()],
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCourseForm({
      ...courseForm,
      requirement_tags: courseForm.requirement_tags.filter(t => t !== tag),
    });
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchQuery === '' || 
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = filterTag === '' || 
      (course.requirement_tags && course.requirement_tags.includes(filterTag));

    return matchesSearch && matchesTag;
  });

  // Get unique tags from all courses
  const allTags = Array.from(new Set(courses.flatMap(c => c.requirement_tags || [])));

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <h1 className="text-base font-semibold text-black">MapMyMajor</h1>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/dashboard" className="text-gray-600 hover:text-black hover:underline">Dashboard</Link>
              <Link href="/courses" className="text-black hover:underline">Course Bank</Link>
              <Link href="/account" className="text-gray-600 hover:text-black hover:underline">Account</Link>
              <span className="text-gray-500">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-1">Course Bank</h2>
          <p className="text-xs text-gray-600">Manage your course library</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex gap-3 items-center mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code, name, or subject..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
            />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 text-xs bg-black text-white hover:bg-gray-800"
            >
              + Add Course
            </button>
          </div>
          <div className="text-xs text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="border border-gray-200 p-8 text-center">
            <p className="text-xs text-gray-500">
              {searchQuery || filterTag ? 'No courses match your filters' : 'No courses yet. Add your first course to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 p-3 hover:border-black transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-black">{course.course_code}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{course.name}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 ml-2">{course.credit_hours} hrs</span>
                </div>

                {course.description && (
                  <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{course.description}</p>
                )}

                {course.requirement_tags && course.requirement_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {course.requirement_tags.map(tag => (
                      <span key={tag} className="text-[9px] bg-gray-100 text-gray-700 px-1 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(course)}
                    className="flex-1 text-center px-2 py-1 text-[11px] border border-gray-300 hover:border-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    disabled={deleting === course.id}
                    className="px-2 py-1 text-[11px] border border-gray-300 hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                  >
                    {deleting === course.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-6 my-8">
            <h3 className="text-base font-semibold text-black mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Course Code, Subject, Number */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={courseForm.course_code}
                    onChange={(e) => setCourseForm({ ...courseForm, course_code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSE110"
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={courseForm.subject}
                    onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSE"
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Number</label>
                  <input
                    type="text"
                    value={courseForm.number}
                    onChange={(e) => setCourseForm({ ...courseForm, number: e.target.value })}
                    placeholder="e.g., 110"
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g., Principles of Programming"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course description..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Credit Hours */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Credit Hours *</label>
                <input
                  type="number"
                  step="0.5"
                  value={courseForm.credit_hours}
                  onChange={(e) => setCourseForm({ ...courseForm, credit_hours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Requirement Tags */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Requirement Tags</label>
                <div className="flex gap-2 mb-2">
                  <select
                    onChange={(e) => {
                      handleAddTag(e.target.value);
                      e.target.value = '';
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="">Select from existing tags...</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or type custom tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleAddTag(input.value);
                        input.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                {courseForm.requirement_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {courseForm.requirement_tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] bg-gray-100 text-gray-700 px-2 py-1 flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveCourse}
                disabled={creating}
                className="flex-1 px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {creating ? 'Saving...' : editingCourse ? 'Update Course' : 'Add Course'}
              </button>
              <button
                onClick={() => {
                  setShowAddCourseModal(false);
                  resetForm();
                }}
                disabled={creating}
                className="px-4 py-2 text-sm border border-gray-300 hover:border-black disabled:opacity-50"
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
