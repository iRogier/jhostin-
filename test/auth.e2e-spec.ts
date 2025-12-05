import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Simple in-memory mock for PrismaService focusing on teacher model used by auth
class MockPrisma {
  teachers: Array<any> = [];
  students: Array<any> = [];

  teacher = {
    findUnique: async ({ where }: { where: any }) => {
      if (where.email) return this.teachers.find((t: any) => t.email === where.email) || null;
      if (where.id) return this.teachers.find((t: any) => t.id === where.id) || null;
      return null;
    },
    create: async ({ data }: { data: any }) => {
      const id = this.teachers.length + 1;
      const saved = { id, ...data };
      this.teachers.push(saved);
      return saved;
    },
  };
  student = {
    findUnique: async ({ where }: { where: any }) => {
      if (where.email) return this.students.find((t: any) => t.email === where.email) || null;
      if (where.id) return this.students.find((t: any) => t.id === where.id) || null;
      return null;
    },
    create: async ({ data }: { data: any }) => {
      const id = this.students.length + 1;
      const saved = { id, ...data };
      this.students.push(saved);
      return saved;
    },
  };
}

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mockPrisma: MockPrisma;

  beforeAll(async () => {
    mockPrisma = new MockPrisma();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma as any)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register -> /auth/login -> /auth/profile', async () => {
    const registerPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.local',
      password: 's3cr3t',
    };

    // register
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerPayload)
      .expect(201);

    expect(registerRes.body).toHaveProperty('id');
    expect(registerRes.body.email).toBe(registerPayload.email);

    // login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: registerPayload.email, password: registerPayload.password })
      .expect(201);

    expect(loginRes.body).toHaveProperty('access_token');
    const token: string = loginRes.body.access_token;

    // profile (protected)
    const profileRes = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body).toHaveProperty('user');
    expect(profileRes.body.user.email).toBe(registerPayload.email);
  });

  it('/auth/register/student -> /auth/login -> /auth/profile (student)', async () => {
    const registerPayload = {
      firstName: 'Student',
      lastName: 'Tester',
      email: 'student@local',
      password: 'studpass',
    };

    // register
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register/student')
      .send(registerPayload)
      .expect(201);

    expect(registerRes.body).toHaveProperty('id');
    expect(registerRes.body.email).toBe(registerPayload.email);

    // login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: registerPayload.email, password: registerPayload.password })
      .expect(201);

    const token: string = loginRes.body.access_token;

    // profile
    const profileRes = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body).toHaveProperty('user');
    expect(profileRes.body.user.email).toBe(registerPayload.email);
  });
});
