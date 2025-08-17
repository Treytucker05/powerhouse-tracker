// Simple test to verify templates and TemplateSelection component
import { templates, checkCompatibility } from '../data/templates';

// Test templates
console.log('Available templates:', templates.length);
templates.forEach(template => {
    console.log(`- ${template.name} (${template.duration} weeks, ${template.goal})`);
});

// Test compatibility function
const mockProgramDetails = {
    trainingExperience: 'intermediate',
    dietPhase: 'bulk',
    trainingDaysPerWeek: 4,
    duration: 12
};

console.log('\nTesting compatibility:');
templates.forEach(template => {
    const result = checkCompatibility(template, mockProgramDetails);
    console.log(`${template.name}: ${result.isCompatible ? '✓ Compatible' : `⚠ Issues: ${result.issues.join(', ')}`}`);
});

export default null;
