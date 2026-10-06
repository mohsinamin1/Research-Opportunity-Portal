const requiredFields = [
  'title',
  'description',
  'research_area',
  'faculty_name',
  'department',
  'required_skills',
  'available_positions',
  'application_deadline',
  'status'
];

export function validateOpportunity(input) {
  const missingFields = requiredFields.filter(
    (field) => input[field] === undefined || input[field] === null || String(input[field]).trim() === ''
  );

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  const positions = Number(input.available_positions);
  if (!Number.isInteger(positions) || positions < 1) {
    return 'available_positions must be a positive whole number';
  }

  if (!['Open', 'Closed'].includes(input.status)) {
    return 'status must be Open or Closed';
  }

  if (Number.isNaN(Date.parse(input.application_deadline))) {
    return 'application_deadline must be a valid date';
  }

  return null;
}

export { requiredFields };
