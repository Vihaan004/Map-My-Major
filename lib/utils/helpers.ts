/**
 * Utility function to merge class names
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format a term and year into a readable string
 */
export function formatSemester(term: string, year: number): string {
  return `${term.charAt(0) + term.slice(1).toLowerCase()} ${year}`;
}

/**
 * Calculate total credits from an array of classes
 */
export function calculateTotalCredits(
  classes: Array<{ classCredits: number | string }>
): number {
  return classes.reduce((total, cls) => {
    const credits = typeof cls.classCredits === 'string' 
      ? parseFloat(cls.classCredits) 
      : cls.classCredits;
    return total + (isNaN(credits) ? 0 : credits);
  }, 0);
}

/**
 * Calculate requirement progress
 */
export function calculateRequirementProgress(
  classes: Array<{ classRequirementTags?: string[] | null; classCredits: number }>,
  requirementTag: string,
  type: 'CREDIT_HOURS' | 'CLASS_COUNT'
): number {
  const matchingClasses = classes.filter(
    cls => cls.classRequirementTags?.includes(requirementTag)
  );

  if (type === 'CREDIT_HOURS') {
    return calculateTotalCredits(matchingClasses);
  } else {
    return matchingClasses.length;
  }
}

/**
 * Generate next semester based on current term and year
 */
export function getNextSemester(currentTerm: string, currentYear: number): {
  term: string;
  year: number;
} {
  const termOrder = ['SPRING', 'SUMMER', 'FALL'];
  const currentIndex = termOrder.indexOf(currentTerm.toUpperCase());
  
  if (currentIndex === -1) {
    throw new Error('Invalid term');
  }

  const nextIndex = (currentIndex + 1) % termOrder.length;
  const nextTerm = termOrder[nextIndex];
  const nextYear = nextTerm === 'SPRING' ? currentYear + 1 : currentYear;

  return { term: nextTerm, year: nextYear };
}

/**
 * Format course code (e.g., "CSE" + "110" => "CSE110")
 */
export function formatCourseCode(subject: string, number: string): string {
  return `${subject.toUpperCase()}${number}`;
}

/**
 * Parse course code into subject and number
 */
export function parseCourseCode(courseCode: string): {
  subject: string;
  number: string;
} | null {
  const match = courseCode.match(/^([A-Z]+)(\d+[A-Z]?)$/i);
  if (!match) return null;
  
  return {
    subject: match[1].toUpperCase(),
    number: match[2],
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate a unique color for a course based on its subject
 */
export function getCourseColor(subject: string): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];
  
  const hash = subject.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
}
