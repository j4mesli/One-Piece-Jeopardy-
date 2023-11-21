import request from 'supertest';
import express from 'express';
import userRouter from '../routes/userRoutes';
import User from '../models/GameUser';
import crypto from 'crypto';
import getMDY from '../functions/getMDY';
import Game from '../models/GameInstance';

// create a mock express app
const app = express();
app.use(express.json());
app.use('/api', userRouter);

// mock user model
jest.mock('../models/GameUser', () => ({
  findOne: jest.fn(),
  aggregate: jest.fn(),
}));

// mock game model
jest.mock('../models/GameInstance', () => ({
  findOne: jest.fn(),
}));

describe('User API Endpoints', () => {
  // clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // login test
  it('should log in a user', async () => {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync('testPassword', salt, 1000, 64, 'sha512').toString('hex');

    // mock user
    const mockUser = {
      username: 'testUser',
      passwordHash: passwordHash,
      salt: salt,
      sessionId: null,
      validatePassword: jest.fn().mockImplementation((password: string) => {
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === passwordHash;
      }),
      save: jest.fn().mockResolvedValue({}),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/login')
      .set('username', 'testUser')
      .set('password', 'testPassword');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('session');
    expect(response.body.session).toHaveProperty('sessionId');
    expect(mockUser.validatePassword).toHaveBeenCalledWith('testPassword');
    expect(mockUser.save).toHaveBeenCalled();
  });

  // logout test
  it('should log out a user', async () => {
    const mockUser = {
      username: 'testUser',
      sessionId: 'validSessionId',
      updateOne: jest.fn().mockResolvedValue({}),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/logout')
      .set('username', 'testUser')
      .set('sessionid', 'validSessionId');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Successfully Logged Out');
    expect(mockUser.updateOne).toHaveBeenCalled();
  });

  // Test for fetchUser
  it('should fetch a user', async () => {
    const mockUser = {
      username: 'testuser',
      avatar: 'avatar.png',
      lastPlayed: getMDY().toISOString(),
      points: 100,
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/api/fetchUser')
      .set('username', 'testUser')
      .set('sessionid', 'validSessionId');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual({
      username: mockUser.username,
      avatar: mockUser.avatar,
      lastPlayed: getMDY().toISOString(),
      points: mockUser.points,
    });
  });

  // Test for verifySessionHandler
  it('should verify user session', async () => {
    const mockUser = {
      username: 'testUser',
      sessionId: 'validSessionId',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/api/verifySession')
      .set('username', 'testUser')
      .set('sessionid', 'validSessionId');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Session Valid');
  });

  // Test for fetchMostRecentGame
  it('should fetch the most recent game of a user', async () => {
    const mockUser = {
      _id: 'userId',
    };
    const mockGame = {
      score: 80,
      category: 'characters',
      attempt: {
        questions: []
      },
      results: [],
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Game.findOne as jest.Mock).mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue(mockGame)
    }));

    const response = await request(app)
      .get('/api/fetchMostRecentGame')
      .set('username', 'testUser')
      .set('sessionid', 'validSessionId');

    expect(response.statusCode).toBe(200);
  });
});
