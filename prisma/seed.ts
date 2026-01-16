import 'dotenv/config';
import { seedAcademic } from './seed-academic';
import { seedProfiles } from './seed-profiles';
import { seedUsers } from './seed-users';

async function main() {
    console.log('🚀 Starting Global Seed Coordination...');

    try {
        console.log('\n--- ACADEMIC ---');
        await seedAcademic();

        console.log('\n--- PROFILES ---');
        await seedProfiles();

        console.log('\n--- USERS ---');
        await seedUsers();

        console.log('\n✨ Global Seed Completed Successfully!');
    } catch (error) {
        console.error('\n❌ Global Seed Failed:');
        console.error(error);
        process.exit(1);
    }
}

main();

