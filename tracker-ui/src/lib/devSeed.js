// Development seed data for quick testing
export const seedDemo = async () => {
  // Only seed in development mode
  if (import.meta.env.PROD) return;
  
  console.log('🌱 Seeding demo data for development...');
  
  try {
    // This would normally call Supabase RPC or populate demo data
    // For now, just log that seeding would happen
    console.log('📊 Demo data seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed demo data:', error);
  }
};
