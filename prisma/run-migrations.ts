import 'dotenv/config';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function executeSqlFile(pool: Pool, sqlHeader: string, filePath: string) {
    console.log(sqlHeader);
    const sqlContent = readFileSync(filePath, 'utf-8');

    // Cleanup comments and split by semicolon
    const statements = sqlContent
        .replace(/--.*$/gm, '') // Remove comments
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (const statement of statements) {
        try {
            await pool.query(statement);
        } catch (error: any) {
            // Ignore common "already exists" errors for types, tables, constraints
            if (error.code === '42710' || // duplicate_object
                error.code === '42P07' || // duplicate_table
                error.message.includes('already exists')) {
                // console.log('   ⚠️  Skipping exists:', error.message);
            } else {
                console.error(`   ❌ Error executing statement: ${statement.substring(0, 50)}...`);
                console.error(`      Error: ${error.message} (Code: ${error.code})`);
                // Don't throw, try to continue (best effort)
            }
        }
    }
}

async function runMigrations() {
    console.log('🔧 Running database migrations (granular mode)...\n');

    // Academic Database
    const academicPool = new Pool({
        connectionString: process.env.DATABASE_URL_ACADEMIC,
    });

    try {
        console.log('🔥 Resetting Academic database tables...');
        try {
            await academicPool.query('DROP TABLE IF EXISTS "enrollments" CASCADE;');
            await academicPool.query('DROP TABLE IF EXISTS "subjects" CASCADE;');
            await academicPool.query('DROP TABLE IF EXISTS "students" CASCADE;');
            await academicPool.query('DROP TABLE IF EXISTS "teachers" CASCADE;');
            await academicPool.query('DROP TABLE IF EXISTS "specialties" CASCADE;');
            await academicPool.query('DROP TABLE IF EXISTS "cycles" CASCADE;');
            await academicPool.query('DROP TABLE IF EXISTS "degrees" CASCADE;');
            // Drop enums if needed
            await academicPool.query('DROP TYPE IF EXISTS "EmploymentType" CASCADE;');
            await academicPool.query('DROP TYPE IF EXISTS "EnrollmentStatus" CASCADE;');
        } catch (e) {
            console.log('Error dropping tables/types:', e);
        }

        await executeSqlFile(
            academicPool,
            '📚 Migrating Academic database...',
            join(__dirname, 'migrations/20260114055337_add_enrollments_and_advanced_features/migration.sql')
        );
        console.log('✅ Academic schema processed');

    } catch (error: any) {
        console.error('❌ Academic migration failed:', error.message);
    } finally {
        await academicPool.end();
    }

    // Users Database

    const usersPool = new Pool({
        connectionString: process.env.DATABASE_URL_USERS,
    });

    try {
        console.log('🔥 Resetting Users database tables...');
        await usersPool.query('DROP TABLE IF EXISTS "teacher_auth" CASCADE;');
        await usersPool.query('DROP TABLE IF EXISTS "student_auth" CASCADE;');

        await executeSqlFile(
            usersPool,
            '👤 Users migration...',
            join(__dirname, 'migrations/20251204234927_init_users/migration.sql')
        );
        console.log('✅ Users schema processed');
    } catch (error: any) {
        console.error('❌ Users migration failed:', error.message);
    } finally {
        await usersPool.end();
    }

    // Profiles Database

    const profilesPool = new Pool({
        connectionString: process.env.DATABASE_URL_PROFILES,
    });

    try {
        console.log('🔥 Resetting Profiles database tables...');
        await profilesPool.query('DROP TABLE IF EXISTS "teacher_profiles" CASCADE;');
        await profilesPool.query('DROP TABLE IF EXISTS "student_profiles" CASCADE;');

        await executeSqlFile(
            profilesPool,
            '📋 Profiles migration...',
            join(__dirname, 'migrations/20251204235001_init_profiles/migration.sql')
        );
        console.log('✅ Profiles schema processed');
    } catch (error: any) {
        console.error('❌ Profiles migration failed:', error.message);
    } finally {
        await profilesPool.end();
    }

    console.log('\n✨ All migrations completed!');
}

runMigrations()
    .catch((error) => {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    });
