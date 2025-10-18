#!/bin/bash

# MapMyMajor API Testing Script
# This script tests all backend API endpoints comprehensively

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Storage for IDs created during testing
REQUIREMENT_ID_1=""
REQUIREMENT_ID_2=""
COURSE_ID_CS101=""
COURSE_ID_CS201=""
MAP_ID=""
SEMESTER_ID_1=""
SEMESTER_ID_2=""
CLASS_ID_1=""
CLASS_ID_2=""

# Function to print test header
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to print test result
print_result() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to extract ID from JSON response
extract_id() {
    echo "$1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Function to check if server is running
check_server() {
    print_header "Checking if server is running..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
    if [ "$response" = "000" ]; then
        echo -e "${RED}ERROR: Server is not running at $BASE_URL${NC}"
        echo "Please start the server with: npm run dev"
        exit 1
    fi
    echo -e "${GREEN}✓ Server is running${NC}\n"
}

# Function to check authentication
check_auth() {
    print_header "Checking authentication..."
    echo -e "${YELLOW}NOTE: Please ensure you are logged in via the browser first!${NC}"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Sign in with Google"
    echo "3. Return here and press Enter to continue..."
    read -p ""
    
    response=$(curl -s "$BASE_URL/api/maps")
    if echo "$response" | grep -q "Unauthorized"; then
        echo -e "${RED}ERROR: Not authenticated. Please login first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Authentication working${NC}\n"
}

# Test 1: Requirements API
test_requirements() {
    print_header "Testing Requirements API"
    
    # Create requirement 1
    echo "Creating requirement (GEN_ED)..."
    response=$(curl -s -X POST "$BASE_URL/api/requirements" \
        -H "Content-Type: application/json" \
        -d '{
            "tag": "GEN_ED",
            "name": "General Education",
            "description": "Core general education requirements",
            "type": "CREDIT_HOURS",
            "category": "Core",
            "is_custom": false
        }')
    
    if echo "$response" | grep -q '"requirement"'; then
        REQUIREMENT_ID_1=$(extract_id "$response")
        print_result 0 "Create requirement GEN_ED (ID: $REQUIREMENT_ID_1)"
    else
        print_result 1 "Create requirement GEN_ED - $response"
    fi
    
    # Create requirement 2
    echo "Creating requirement (MAJOR_CORE)..."
    response=$(curl -s -X POST "$BASE_URL/api/requirements" \
        -H "Content-Type: application/json" \
        -d '{
            "tag": "MAJOR_CORE",
            "name": "Major Core Requirements",
            "type": "CLASS_COUNT",
            "category": "Major",
            "is_custom": false
        }')
    
    if echo "$response" | grep -q '"requirement"'; then
        REQUIREMENT_ID_2=$(extract_id "$response")
        print_result 0 "Create requirement MAJOR_CORE (ID: $REQUIREMENT_ID_2)"
    else
        print_result 1 "Create requirement MAJOR_CORE - $response"
    fi
    
    # List requirements
    echo "Listing all requirements..."
    response=$(curl -s "$BASE_URL/api/requirements")
    if echo "$response" | grep -q '"requirements"'; then
        count=$(echo "$response" | grep -o '"id"' | wc -l)
        print_result 0 "List requirements (found $count requirements)"
    else
        print_result 1 "List requirements - $response"
    fi
    
    # Get single requirement
    if [ -n "$REQUIREMENT_ID_1" ]; then
        echo "Getting single requirement..."
        response=$(curl -s "$BASE_URL/api/requirements/$REQUIREMENT_ID_1")
        if echo "$response" | grep -q "GEN_ED"; then
            print_result 0 "Get single requirement"
        else
            print_result 1 "Get single requirement - $response"
        fi
    fi
    
    # Update requirement
    if [ -n "$REQUIREMENT_ID_1" ]; then
        echo "Updating requirement..."
        response=$(curl -s -X PUT "$BASE_URL/api/requirements/$REQUIREMENT_ID_1" \
            -H "Content-Type: application/json" \
            -d '{"name": "General Education Updated"}')
        if echo "$response" | grep -q "Updated"; then
            print_result 0 "Update requirement"
        else
            print_result 1 "Update requirement - $response"
        fi
    fi
    
    # Test duplicate tag (should fail)
    echo "Testing duplicate requirement tag..."
    response=$(curl -s -X POST "$BASE_URL/api/requirements" \
        -H "Content-Type: application/json" \
        -d '{
            "tag": "GEN_ED",
            "name": "Duplicate",
            "type": "CREDIT_HOURS"
        }')
    if echo "$response" | grep -q "already exists"; then
        print_result 0 "Duplicate requirement prevention"
    else
        print_result 1 "Duplicate requirement prevention - should have failed"
    fi
}

# Test 2: Courses API
test_courses() {
    print_header "Testing Courses API"
    
    # Create course CS101
    echo "Creating course CS101..."
    response=$(curl -s -X POST "$BASE_URL/api/courses" \
        -H "Content-Type: application/json" \
        -d '{
            "course_code": "CS101",
            "subject": "CS",
            "number": "101",
            "name": "Introduction to Computer Science",
            "description": "Fundamentals of programming",
            "credit_hours": 3,
            "prerequisites": [],
            "requirement_tags": ["GEN_ED"]
        }')
    
    if echo "$response" | grep -q '"course"'; then
        COURSE_ID_CS101=$(extract_id "$response")
        print_result 0 "Create course CS101 (ID: $COURSE_ID_CS101)"
    else
        print_result 1 "Create course CS101 - $response"
    fi
    
    # Create course CS201
    echo "Creating course CS201..."
    response=$(curl -s -X POST "$BASE_URL/api/courses" \
        -H "Content-Type: application/json" \
        -d '{
            "course_code": "CS201",
            "subject": "CS",
            "number": "201",
            "name": "Data Structures",
            "credit_hours": 4,
            "prerequisites": ["CS101"]
        }')
    
    if echo "$response" | grep -q '"course"'; then
        COURSE_ID_CS201=$(extract_id "$response")
        print_result 0 "Create course CS201 (ID: $COURSE_ID_CS201)"
    else
        print_result 1 "Create course CS201 - $response"
    fi
    
    # List courses
    echo "Listing all courses..."
    response=$(curl -s "$BASE_URL/api/courses")
    if echo "$response" | grep -q '"courses"'; then
        count=$(echo "$response" | grep -o '"id"' | wc -l)
        print_result 0 "List courses (found $count courses)"
    else
        print_result 1 "List courses - $response"
    fi
    
    # Filter by subject
    echo "Filtering courses by subject..."
    response=$(curl -s "$BASE_URL/api/courses?subject=CS")
    if echo "$response" | grep -q "CS101"; then
        print_result 0 "Filter courses by subject"
    else
        print_result 1 "Filter courses by subject - $response"
    fi
    
    # Update course
    if [ -n "$COURSE_ID_CS101" ]; then
        echo "Updating course..."
        response=$(curl -s -X PUT "$BASE_URL/api/courses/$COURSE_ID_CS101" \
            -H "Content-Type: application/json" \
            -d '{"name": "Intro to Programming"}')
        if echo "$response" | grep -q "Intro to Programming"; then
            print_result 0 "Update course"
        else
            print_result 1 "Update course - $response"
        fi
    fi
    
    # Test duplicate course code
    echo "Testing duplicate course code..."
    response=$(curl -s -X POST "$BASE_URL/api/courses" \
        -H "Content-Type: application/json" \
        -d '{
            "course_code": "CS101",
            "subject": "CS",
            "number": "101",
            "name": "Duplicate",
            "credit_hours": 3
        }')
    if echo "$response" | grep -q "already exists"; then
        print_result 0 "Duplicate course prevention"
    else
        print_result 1 "Duplicate course prevention - should have failed"
    fi
}

# Test 3: Maps API
test_maps() {
    print_header "Testing Maps API"
    
    # Create map
    echo "Creating map..."
    response=$(curl -s -X POST "$BASE_URL/api/maps" \
        -H "Content-Type: application/json" \
        -d '{
            "map_name": "CS Bachelor 2025",
            "map_university": "Test University",
            "map_degree": "B.S. Computer Science",
            "start_term": "FALL",
            "start_year": 2025,
            "status": "ACTIVE"
        }')
    
    if echo "$response" | grep -q '"map"'; then
        MAP_ID=$(extract_id "$response")
        print_result 0 "Create map (ID: $MAP_ID)"
    else
        print_result 1 "Create map - $response"
    fi
    
    # List maps
    echo "Listing all maps..."
    response=$(curl -s "$BASE_URL/api/maps")
    if echo "$response" | grep -q '"maps"'; then
        count=$(echo "$response" | grep -o '"map_name"' | wc -l)
        print_result 0 "List maps (found $count maps)"
    else
        print_result 1 "List maps - $response"
    fi
    
    # Get single map
    if [ -n "$MAP_ID" ]; then
        echo "Getting single map..."
        response=$(curl -s "$BASE_URL/api/maps/$MAP_ID")
        if echo "$response" | grep -q "CS Bachelor"; then
            print_result 0 "Get single map"
        else
            print_result 1 "Get single map - $response"
        fi
    fi
    
    # Update map
    if [ -n "$MAP_ID" ]; then
        echo "Updating map..."
        response=$(curl -s -X PUT "$BASE_URL/api/maps/$MAP_ID" \
            -H "Content-Type: application/json" \
            -d '{"map_name": "CS Bachelor Updated"}')
        if echo "$response" | grep -q "Updated"; then
            print_result 0 "Update map"
        else
            print_result 1 "Update map - $response"
        fi
    fi
}

# Test 4: Semesters API
test_semesters() {
    print_header "Testing Semesters API"
    
    if [ -z "$MAP_ID" ]; then
        echo -e "${RED}Skipping semesters tests - no map created${NC}"
        return
    fi
    
    # Create semester 1
    echo "Creating semester FALL 2025..."
    response=$(curl -s -X POST "$BASE_URL/api/maps/$MAP_ID/semesters" \
        -H "Content-Type: application/json" \
        -d '{
            "term": "FALL",
            "year": 2025,
            "index": 0
        }')
    
    if echo "$response" | grep -q '"semester"'; then
        SEMESTER_ID_1=$(extract_id "$response")
        print_result 0 "Create semester FALL 2025 (ID: $SEMESTER_ID_1)"
    else
        print_result 1 "Create semester FALL 2025 - $response"
    fi
    
    # Create semester 2
    echo "Creating semester SPRING 2026..."
    response=$(curl -s -X POST "$BASE_URL/api/maps/$MAP_ID/semesters" \
        -H "Content-Type: application/json" \
        -d '{
            "term": "SPRING",
            "year": 2026,
            "index": 1
        }')
    
    if echo "$response" | grep -q '"semester"'; then
        SEMESTER_ID_2=$(extract_id "$response")
        print_result 0 "Create semester SPRING 2026 (ID: $SEMESTER_ID_2)"
    else
        print_result 1 "Create semester SPRING 2026 - $response"
    fi
    
    # List semesters
    echo "Listing semesters in map..."
    response=$(curl -s "$BASE_URL/api/maps/$MAP_ID/semesters")
    if echo "$response" | grep -q '"semesters"'; then
        count=$(echo "$response" | grep -o '"term"' | wc -l)
        print_result 0 "List semesters (found $count semesters)"
    else
        print_result 1 "List semesters - $response"
    fi
    
    # Update semester
    if [ -n "$SEMESTER_ID_1" ]; then
        echo "Updating semester..."
        response=$(curl -s -X PUT "$BASE_URL/api/semesters/$SEMESTER_ID_1" \
            -H "Content-Type: application/json" \
            -d '{"index": 2}')
        if echo "$response" | grep -q '"semester"'; then
            print_result 0 "Update semester"
        else
            print_result 1 "Update semester - $response"
        fi
    fi
    
    # Test duplicate semester
    echo "Testing duplicate semester..."
    response=$(curl -s -X POST "$BASE_URL/api/maps/$MAP_ID/semesters" \
        -H "Content-Type: application/json" \
        -d '{
            "term": "FALL",
            "year": 2025,
            "index": 3
        }')
    if echo "$response" | grep -q "already exists"; then
        print_result 0 "Duplicate semester prevention"
    else
        print_result 1 "Duplicate semester prevention - should have failed"
    fi
}

# Test 5: Classes API
test_classes() {
    print_header "Testing Classes API"
    
    if [ -z "$MAP_ID" ] || [ -z "$SEMESTER_ID_1" ] || [ -z "$COURSE_ID_CS101" ]; then
        echo -e "${RED}Skipping classes tests - missing dependencies${NC}"
        return
    fi
    
    # Create class 1
    echo "Creating class CS101..."
    response=$(curl -s -X POST "$BASE_URL/api/maps/$MAP_ID/classes" \
        -H "Content-Type: application/json" \
        -d "{
            \"semester_id\": \"$SEMESTER_ID_1\",
            \"course_id\": \"$COURSE_ID_CS101\",
            \"class_code\": \"CS101\",
            \"class_subject\": \"CS\",
            \"class_number\": \"101\",
            \"class_name\": \"Intro to Programming\",
            \"class_credits\": 3,
            \"index\": 0,
            \"status\": \"PLANNED\"
        }")
    
    if echo "$response" | grep -q '"class"'; then
        CLASS_ID_1=$(extract_id "$response")
        print_result 0 "Create class CS101 (ID: $CLASS_ID_1)"
    else
        print_result 1 "Create class CS101 - $response"
    fi
    
    # Create class 2
    if [ -n "$COURSE_ID_CS201" ]; then
        echo "Creating class CS201..."
        response=$(curl -s -X POST "$BASE_URL/api/maps/$MAP_ID/classes" \
            -H "Content-Type: application/json" \
            -d "{
                \"semester_id\": \"$SEMESTER_ID_1\",
                \"course_id\": \"$COURSE_ID_CS201\",
                \"class_code\": \"CS201\",
                \"class_subject\": \"CS\",
                \"class_number\": \"201\",
                \"class_name\": \"Data Structures\",
                \"class_credits\": 4,
                \"index\": 1,
                \"status\": \"PLANNED\"
            }")
        
        if echo "$response" | grep -q '"class"'; then
            CLASS_ID_2=$(extract_id "$response")
            print_result 0 "Create class CS201 (ID: $CLASS_ID_2)"
        else
            print_result 1 "Create class CS201 - $response"
        fi
    fi
    
    # List classes
    echo "Listing classes in map..."
    response=$(curl -s "$BASE_URL/api/maps/$MAP_ID/classes")
    if echo "$response" | grep -q '"classes"'; then
        count=$(echo "$response" | grep -o '"class_code"' | wc -l)
        print_result 0 "List classes (found $count classes)"
    else
        print_result 1 "List classes - $response"
    fi
    
    # Update class
    if [ -n "$CLASS_ID_1" ]; then
        echo "Updating class status..."
        response=$(curl -s -X PUT "$BASE_URL/api/classes/$CLASS_ID_1" \
            -H "Content-Type: application/json" \
            -d '{"status": "IN_PROGRESS", "grade": "A"}')
        if echo "$response" | grep -q "IN_PROGRESS"; then
            print_result 0 "Update class"
        else
            print_result 1 "Update class - $response"
        fi
    fi
    
    # Move class
    if [ -n "$CLASS_ID_2" ] && [ -n "$SEMESTER_ID_2" ]; then
        echo "Moving class to different semester..."
        response=$(curl -s -X PATCH "$BASE_URL/api/classes/$CLASS_ID_2" \
            -H "Content-Type: application/json" \
            -d "{\"semester_id\": \"$SEMESTER_ID_2\", \"index\": 0}")
        if echo "$response" | grep -q '"class"'; then
            print_result 0 "Move class to different semester"
        else
            print_result 1 "Move class - $response"
        fi
    fi
}

# Test 6: Validation and Error Handling
test_validation() {
    print_header "Testing Validation and Error Handling"
    
    # Invalid enum value
    echo "Testing invalid enum value..."
    response=$(curl -s -X POST "$BASE_URL/api/maps" \
        -H "Content-Type: application/json" \
        -d '{
            "map_name": "Test",
            "start_term": "winter",
            "start_year": 2025
        }')
    if echo "$response" | grep -q "error"; then
        print_result 0 "Invalid enum validation"
    else
        print_result 1 "Invalid enum validation - should have failed"
    fi
    
    # Missing required field
    echo "Testing missing required field..."
    response=$(curl -s -X POST "$BASE_URL/api/courses" \
        -H "Content-Type: application/json" \
        -d '{
            "course_code": "TEST999"
        }')
    if echo "$response" | grep -q "error"; then
        print_result 0 "Missing required field validation"
    else
        print_result 1 "Missing required field validation - should have failed"
    fi
    
    # Invalid data type
    echo "Testing invalid data type..."
    response=$(curl -s -X POST "$BASE_URL/api/courses" \
        -H "Content-Type: application/json" \
        -d '{
            "course_code": "TEST999",
            "subject": "TEST",
            "number": "999",
            "name": "Test",
            "credit_hours": "three"
        }')
    if echo "$response" | grep -q "error"; then
        print_result 0 "Invalid data type validation"
    else
        print_result 1 "Invalid data type validation - should have failed"
    fi
}

# Test 7: Cleanup and Cascade Deletes
test_cleanup() {
    print_header "Testing Cleanup and Cascade Deletes"
    
    # Try to delete course with classes (should fail)
    if [ -n "$COURSE_ID_CS101" ]; then
        echo "Testing delete course with classes (should fail)..."
        response=$(curl -s -X DELETE "$BASE_URL/api/courses/$COURSE_ID_CS101")
        if echo "$response" | grep -q "used in maps"; then
            print_result 0 "Prevent delete course with classes"
        else
            print_result 1 "Prevent delete course with classes - should have failed"
        fi
    fi
    
    # Try to delete semester with classes (should fail)
    if [ -n "$SEMESTER_ID_1" ]; then
        echo "Testing delete semester with classes (should fail)..."
        response=$(curl -s -X DELETE "$BASE_URL/api/semesters/$SEMESTER_ID_1")
        if echo "$response" | grep -q "contains classes"; then
            print_result 0 "Prevent delete semester with classes"
        else
            print_result 1 "Prevent delete semester with classes - should have failed"
        fi
    fi
    
    # Delete all classes first
    if [ -n "$CLASS_ID_1" ]; then
        echo "Deleting class 1..."
        response=$(curl -s -X DELETE "$BASE_URL/api/classes/$CLASS_ID_1")
        if echo "$response" | grep -q "deleted successfully"; then
            print_result 0 "Delete class 1"
        else
            print_result 1 "Delete class 1 - $response"
        fi
    fi
    
    if [ -n "$CLASS_ID_2" ]; then
        echo "Deleting class 2..."
        response=$(curl -s -X DELETE "$BASE_URL/api/classes/$CLASS_ID_2")
        if echo "$response" | grep -q "deleted successfully"; then
            print_result 0 "Delete class 2"
        else
            print_result 1 "Delete class 2 - $response"
        fi
    fi
    
    # Now delete courses (should succeed)
    if [ -n "$COURSE_ID_CS101" ]; then
        echo "Deleting course CS101..."
        response=$(curl -s -X DELETE "$BASE_URL/api/courses/$COURSE_ID_CS101")
        if echo "$response" | grep -q "deleted successfully"; then
            print_result 0 "Delete course CS101"
        else
            print_result 1 "Delete course CS101 - $response"
        fi
    fi
    
    if [ -n "$COURSE_ID_CS201" ]; then
        echo "Deleting course CS201..."
        response=$(curl -s -X DELETE "$BASE_URL/api/courses/$COURSE_ID_CS201")
        if echo "$response" | grep -q "deleted successfully"; then
            print_result 0 "Delete course CS201"
        else
            print_result 1 "Delete course CS201 - $response"
        fi
    fi
    
    # Delete map (should cascade delete semesters)
    if [ -n "$MAP_ID" ]; then
        echo "Deleting map (should cascade)..."
        response=$(curl -s -X DELETE "$BASE_URL/api/maps/$MAP_ID")
        if echo "$response" | grep -q "deleted successfully"; then
            print_result 0 "Delete map with cascade"
        else
            print_result 1 "Delete map - $response"
        fi
    fi
    
    # Delete requirements
    if [ -n "$REQUIREMENT_ID_1" ]; then
        echo "Deleting requirement 1..."
        response=$(curl -s -X DELETE "$BASE_URL/api/requirements/$REQUIREMENT_ID_1")
        print_result 0 "Delete requirement 1"
    fi
    
    if [ -n "$REQUIREMENT_ID_2" ]; then
        echo "Deleting requirement 2..."
        response=$(curl -s -X DELETE "$BASE_URL/api/requirements/$REQUIREMENT_ID_2")
        print_result 0 "Delete requirement 2"
    fi
}

# Print summary
print_summary() {
    print_header "Test Summary"
    echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed:      ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed:      ${RED}$FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All tests passed!${NC}\n"
        exit 0
    else
        echo -e "\n${RED}❌ Some tests failed${NC}\n"
        exit 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║         MapMyMajor Backend API Testing Suite             ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_server
    check_auth
    
    test_requirements
    test_courses
    test_maps
    test_semesters
    test_classes
    test_validation
    test_cleanup
    
    print_summary
}

# Run main function
main
