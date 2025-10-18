'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

type TestResult = {
  endpoint: string;
  method: string;
  status: number;
  response: any;
  error?: string;
  timestamp: string;
};

export default function APITestPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Store created IDs for dependent tests
  const [testData, setTestData] = useState({
    requirementId1: '',
    requirementId2: '',
    courseIdCS101: '',
    courseIdCS201: '',
    mapId: '',
    semesterId1: '',
    semesterId2: '',
    classId1: '',
    classId2: '',
  });

  const addResult = (result: TestResult) => {
    setResults((prev) => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const makeRequest = async (
    method: string,
    endpoint: string,
    body?: any,
    description?: string
  ) => {
    setLoading(true);
    const timestamp = new Date().toISOString();

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      addResult({
        endpoint: `${method} ${endpoint}${description ? ` (${description})` : ''}`,
        method,
        status: response.status,
        response: data,
        timestamp,
      });

      setLoading(false);
      return { status: response.status, data };
    } catch (error: any) {
      addResult({
        endpoint: `${method} ${endpoint}${description ? ` (${description})` : ''}`,
        method,
        status: 0,
        response: null,
        error: error.message,
        timestamp,
      });
      setLoading(false);
      return { status: 0, data: null, error: error.message };
    }
  };

  // Test functions for each API category

  const testRequirements = async () => {
    // Create requirement 1
    const req1 = await makeRequest('POST', '/api/requirements', {
      tag: 'GEN_ED',
      name: 'General Education',
      description: 'Core general education requirements',
      type: 'CREDIT_HOURS',
      category: 'Core',
      is_custom: false,
    }, 'Create GEN_ED');
    
    if (req1.data?.requirement?.id) {
      setTestData(prev => ({ ...prev, requirementId1: req1.data.requirement.id }));
    }

    // Create requirement 2
    const req2 = await makeRequest('POST', '/api/requirements', {
      tag: 'MAJOR_CORE',
      name: 'Major Core Requirements',
      type: 'CLASS_COUNT',
      category: 'Major',
      is_custom: false,
    }, 'Create MAJOR_CORE');
    
    if (req2.data?.requirement?.id) {
      setTestData(prev => ({ ...prev, requirementId2: req2.data.requirement.id }));
    }

    // List all
    await makeRequest('GET', '/api/requirements', null, 'List all');

    // Filter by type
    await makeRequest('GET', '/api/requirements?type=CREDIT_HOURS', null, 'Filter by type');

    // Update
    if (req1.data?.requirement?.id) {
      await makeRequest('PUT', `/api/requirements/${req1.data.requirement.id}`, {
        name: 'General Education Updated',
      }, 'Update requirement');
    }

    // Test duplicate (should fail)
    await makeRequest('POST', '/api/requirements', {
      tag: 'GEN_ED',
      name: 'Duplicate',
      type: 'CREDIT_HOURS',
    }, 'Test duplicate (should fail)');
  };

  const testCourses = async () => {
    // Create CS101
    const cs101 = await makeRequest('POST', '/api/courses', {
      course_code: 'CS101',
      subject: 'CS',
      number: '101',
      name: 'Introduction to Computer Science',
      description: 'Fundamentals of programming',
      credit_hours: 3,
      prerequisites: [],
      requirement_tags: ['GEN_ED'],
    }, 'Create CS101');
    
    if (cs101.data?.course?.id) {
      setTestData(prev => ({ ...prev, courseIdCS101: cs101.data.course.id }));
    }

    // Create CS201
    const cs201 = await makeRequest('POST', '/api/courses', {
      course_code: 'CS201',
      subject: 'CS',
      number: '201',
      name: 'Data Structures',
      credit_hours: 4,
      prerequisites: ['CS101'],
    }, 'Create CS201');
    
    if (cs201.data?.course?.id) {
      setTestData(prev => ({ ...prev, courseIdCS201: cs201.data.course.id }));
    }

    // List all
    await makeRequest('GET', '/api/courses', null, 'List all courses');

    // Filter by subject
    await makeRequest('GET', '/api/courses?subject=CS', null, 'Filter by subject');

    // Update
    if (cs101.data?.course?.id) {
      await makeRequest('PUT', `/api/courses/${cs101.data.course.id}`, {
        name: 'Intro to Programming',
      }, 'Update course');
    }

    // Test duplicate (should fail)
    await makeRequest('POST', '/api/courses', {
      course_code: 'CS101',
      subject: 'CS',
      number: '101',
      name: 'Duplicate',
      credit_hours: 3,
    }, 'Test duplicate (should fail)');
  };

  const testMaps = async () => {
    // Create map
    const map = await makeRequest('POST', '/api/maps', {
      map_name: 'CS Bachelor 2025',
      map_university: 'Test University',
      map_degree: 'B.S. Computer Science',
      start_term: 'FALL',
      start_year: 2025,
      status: 'ACTIVE',
    }, 'Create map');
    
    if (map.data?.map?.id) {
      setTestData(prev => ({ ...prev, mapId: map.data.map.id }));
    }

    // List all
    await makeRequest('GET', '/api/maps', null, 'List all maps');

    // Get single
    if (map.data?.map?.id) {
      await makeRequest('GET', `/api/maps/${map.data.map.id}`, null, 'Get single map');

      // Update
      await makeRequest('PUT', `/api/maps/${map.data.map.id}`, {
        map_name: 'CS Bachelor Updated',
      }, 'Update map');
    }
  };

  const testSemesters = async () => {
    if (!testData.mapId) {
      addResult({
        endpoint: 'Semesters Test',
        method: 'SKIP',
        status: 0,
        response: { error: 'No map created. Run Maps tests first.' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Create semester 1
    const sem1 = await makeRequest('POST', `/api/maps/${testData.mapId}/semesters`, {
      term: 'FALL',
      year: 2025,
      index: 0,
    }, 'Create FALL 2025');
    
    if (sem1.data?.semester?.id) {
      setTestData(prev => ({ ...prev, semesterId1: sem1.data.semester.id }));
    }

    // Create semester 2
    const sem2 = await makeRequest('POST', `/api/maps/${testData.mapId}/semesters`, {
      term: 'SPRING',
      year: 2026,
      index: 1,
    }, 'Create SPRING 2026');
    
    if (sem2.data?.semester?.id) {
      setTestData(prev => ({ ...prev, semesterId2: sem2.data.semester.id }));
    }

    // List semesters
    await makeRequest('GET', `/api/maps/${testData.mapId}/semesters`, null, 'List semesters');

    // Update semester
    if (sem1.data?.semester?.id) {
      await makeRequest('PUT', `/api/semesters/${sem1.data.semester.id}`, {
        index: 2,
      }, 'Update semester');
    }

    // Test duplicate (should fail)
    await makeRequest('POST', `/api/maps/${testData.mapId}/semesters`, {
      term: 'FALL',
      year: 2025,
      index: 3,
    }, 'Test duplicate (should fail)');
  };

  const testClasses = async () => {
    if (!testData.mapId || !testData.semesterId1 || !testData.courseIdCS101) {
      addResult({
        endpoint: 'Classes Test',
        method: 'SKIP',
        status: 0,
        response: { error: 'Missing dependencies. Run Maps, Semesters, and Courses tests first.' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Create class 1
    const class1 = await makeRequest('POST', `/api/maps/${testData.mapId}/classes`, {
      semester_id: testData.semesterId1,
      course_id: testData.courseIdCS101,
      class_code: 'CS101',
      class_subject: 'CS',
      class_number: '101',
      class_name: 'Intro to Programming',
      class_credits: 3,
      index: 0,
      status: 'PLANNED',
    }, 'Create CS101 class');
    
    if (class1.data?.class?.id) {
      setTestData(prev => ({ ...prev, classId1: class1.data.class.id }));
    }

    // Create class 2
    if (testData.courseIdCS201) {
      const class2 = await makeRequest('POST', `/api/maps/${testData.mapId}/classes`, {
        semester_id: testData.semesterId1,
        course_id: testData.courseIdCS201,
        class_code: 'CS201',
        class_subject: 'CS',
        class_number: '201',
        class_name: 'Data Structures',
        class_credits: 4,
        index: 1,
        status: 'PLANNED',
      }, 'Create CS201 class');
      
      if (class2.data?.class?.id) {
        setTestData(prev => ({ ...prev, classId2: class2.data.class.id }));
      }
    }

    // List classes
    await makeRequest('GET', `/api/maps/${testData.mapId}/classes`, null, 'List all classes');

    // Update class
    if (class1.data?.class?.id) {
      await makeRequest('PUT', `/api/classes/${class1.data.class.id}`, {
        status: 'IN_PROGRESS',
        grade: 'A',
      }, 'Update class status');
    }

    // Move class
    if (testData.classId2 && testData.semesterId2) {
      await makeRequest('PATCH', `/api/classes/${testData.classId2}`, {
        semester_id: testData.semesterId2,
        index: 0,
      }, 'Move class to different semester');
    }
  };

  const testValidation = async () => {
    // Invalid enum
    await makeRequest('POST', '/api/maps', {
      map_name: 'Test',
      start_term: 'winter',
      start_year: 2025,
    }, 'Invalid enum (should fail)');

    // Missing required field
    await makeRequest('POST', '/api/courses', {
      course_code: 'TEST999',
    }, 'Missing required field (should fail)');

    // Invalid data type
    await makeRequest('POST', '/api/courses', {
      course_code: 'TEST999',
      subject: 'TEST',
      number: '999',
      name: 'Test',
      credit_hours: 'three',
    }, 'Invalid data type (should fail)');
  };

  const testCleanup = async () => {
    clearResults();
    
    // Fetch and delete all classes
    const classesRes = await makeRequest('GET', '/api/classes', null, 'Fetch all classes');
    if (classesRes?.data?.classes && Array.isArray(classesRes.data.classes)) {
      for (const cls of classesRes.data.classes) {
        await makeRequest('DELETE', `/api/classes/${cls.id}`, null, `Delete class: ${cls.id}`);
      }
    }

    // Fetch and delete all courses
    const coursesRes = await makeRequest('GET', '/api/courses', null, 'Fetch all courses');
    if (coursesRes?.data?.courses && Array.isArray(coursesRes.data.courses)) {
      for (const course of coursesRes.data.courses) {
        await makeRequest('DELETE', `/api/courses/${course.id}`, null, `Delete course: ${course.code}`);
      }
    }

    // Fetch and delete all maps (cascade deletes semesters)
    const mapsRes = await makeRequest('GET', '/api/maps', null, 'Fetch all maps');
    if (mapsRes?.data?.maps && Array.isArray(mapsRes.data.maps)) {
      for (const map of mapsRes.data.maps) {
        await makeRequest('DELETE', `/api/maps/${map.id}`, null, `Delete map: ${map.name}`);
      }
    }

    // Fetch and delete all requirements
    const requirementsRes = await makeRequest('GET', '/api/requirements', null, 'Fetch all requirements');
    if (requirementsRes?.data?.requirements && Array.isArray(requirementsRes.data.requirements)) {
      for (const req of requirementsRes.data.requirements) {
        // Skip custom requirements (they can't be deleted)
        if (!req.isCustom) {
          await makeRequest('DELETE', `/api/requirements/${req.id}`, null, `Delete requirement: ${req.tag}`);
        }
      }
    }

    // Clear test data
    setTestData({
      requirementId1: '',
      requirementId2: '',
      courseIdCS101: '',
      courseIdCS201: '',
      mapId: '',
      semesterId1: '',
      semesterId2: '',
      classId1: '',
      classId2: '',
    });
  };

  const testAll = async () => {
    clearResults();
    await testRequirements();
    await testCourses();
    await testMaps();
    await testSemesters();
    await testClasses();
    await testValidation();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be authenticated to test the API endpoints.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const filteredResults = selectedCategory === 'all' 
    ? results 
    : results.filter(r => r.endpoint.toLowerCase().includes(selectedCategory.toLowerCase()));

  const stats = {
    total: results.length,
    success: results.filter(r => r.status >= 200 && r.status < 300).length,
    error: results.filter(r => r.status >= 400 || r.status === 0).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Testing Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive testing for all backend endpoints
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Logged in as: {session.user?.email}
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={testRequirements}
              disabled={loading}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Requirements
            </button>
            <button
              onClick={testCourses}
              disabled={loading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Courses
            </button>
            <button
              onClick={testMaps}
              disabled={loading}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Maps
            </button>
            <button
              onClick={testSemesters}
              disabled={loading}
              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Semesters
            </button>
            <button
              onClick={testClasses}
              disabled={loading}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Classes
            </button>
            <button
              onClick={testValidation}
              disabled={loading}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Validation
            </button>
            <button
              onClick={testAll}
              disabled={loading}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              Run All Tests
            </button>
            <button
              onClick={() => {
                if (confirm('⚠️ This will DELETE ALL your data (maps, courses, classes, semesters, requirements). Are you sure?')) {
                  testCleanup();
                }
              }}
              disabled={loading}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              🗑️ Delete All Data
            </button>
          </div>
          <button
            onClick={clearResults}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Clear Results
          </button>
        </div>

        {/* Stats */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.success}</div>
                <div className="text-sm text-gray-600">Success</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.error}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Results:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Results</option>
              <option value="requirements">Requirements</option>
              <option value="courses">Courses</option>
              <option value="maps">Maps</option>
              <option value="semesters">Semesters</option>
              <option value="classes">Classes</option>
              <option value="validation">Validation</option>
            </select>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {filteredResults.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No test results yet. Click a test button above to start testing.
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Running tests...</p>
            </div>
          )}

          {filteredResults.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                result.status >= 200 && result.status < 300
                  ? 'border-green-500'
                  : result.status >= 400 || result.status === 0
                  ? 'border-red-500'
                  : 'border-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        result.method === 'GET'
                          ? 'bg-blue-100 text-blue-800'
                          : result.method === 'POST'
                          ? 'bg-green-100 text-green-800'
                          : result.method === 'PUT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : result.method === 'DELETE'
                          ? 'bg-red-100 text-red-800'
                          : result.method === 'PATCH'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {result.method}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        result.status >= 200 && result.status < 300
                          ? 'bg-green-100 text-green-800'
                          : result.status >= 400 || result.status === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {result.status || 'ERROR'}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-700">
                    {result.endpoint}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    View Response
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                    {result.error
                      ? `Error: ${result.error}`
                      : JSON.stringify(result.response, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>

        {/* Test Data Display */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Created Test Data IDs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm">
            {Object.entries(testData).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-gray-600">{key}:</span>
                <span className={value ? 'text-green-600' : 'text-gray-400'}>
                  {value || 'Not created'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
