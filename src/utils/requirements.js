// Common requirement templates that can be pre-populated
export const commonRequirements = [
  { name: 'Humanities', tag: 'HU' },
  { name: 'Social & Behavioral Sciences', tag: 'SB' },
  { name: 'Natural Sciences', tag: 'SQ/SG' },
  { name: 'Literacy', tag: 'L' },
  { name: 'Cultural Diversity', tag: 'C' },
  { name: 'Global Awareness', tag: 'G' },
  { name: 'Historical Awareness', tag: 'H' }
];

// Helper function to detect requirement tags from class name or title
export const detectRequirements = (className, classTitle) => {
  const tags = [];
  
  // Common subject code patterns
  if (className.match(/^ENG/i)) tags.push('L');
  if (className.match(/^PHY/i)) tags.push('SQ');
  if (className.match(/^CHM/i)) tags.push('SQ');
  if (className.match(/^BIO/i)) tags.push('SQ');
  if (className.match(/^ASM|^SOC|^PSY/i)) tags.push('SB');
  if (className.match(/^MUS|^ART|^THE/i)) tags.push('HU');
  if (className.match(/^HIS/i)) {
    tags.push('HU');
    tags.push('H');
  }
  if (classTitle && classTitle.match(/global|world|international/i)) tags.push('G');
  if (classTitle && classTitle.match(/cultur|divers|ethnic/i)) tags.push('C');
  
  return tags;
};
