import request from 'supertest';
import express from 'express';
import gameRouter from '../routes/gameRoutes';
import User from '../models/GameUser';
import Game from '../models/GameInstance';
import crypto from 'crypto';
import testQuestions from '../json/testQuestions.json';

// Mock express app
const app = express();
app.use(express.json());
app.use('/api', gameRouter);

// Mock User and Game models
jest.mock('../models/GameUser', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  aggregate: jest.fn(),
}));
jest.mock('../models/GameInstance', () => ({
  save: jest.fn(),
  findOne: jest.fn(),
}));

describe('Game API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for fetchTestsHandler
  it('should fetch test questions', async () => {
    // Setup mock user
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync('testPassword', salt, 1000, 64, 'sha512').toString('hex');
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

    const response = await request(app).get('/api/fetchTestQuestions').set('sessionid', 'validSessionId');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('questions');
    expect(response.body.questions).toEqual(testQuestions);
  });

  // Test for fetchLeaderboard
  it('should fetch the leaderboard', async () => {
    // Mock leaderboard data
    const mockLeaderboard = [
      { username: 'user1', points: 100, lastPlayed: '2023-01-01', avatar: 'avatar1.png', pastGames: [] },
      { username: 'user2', points: 90, lastPlayed: '2023-01-02', avatar: 'avatar2.png', pastGames: [] },
    ];

    // Mock User.find and sort
    (User.find as jest.Mock).mockImplementation(() => ({
      sort: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue(mockLeaderboard)
      }))
    }));

    const response = await request(app).get('/api/fetchLeaderboard').set('sessionid', 'validSessionId');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('leaderboard');
    expect(response.body.leaderboard).toEqual(mockLeaderboard.map(user => ({
      username: user.username,
      points: user.points,
      lastPlayed: user.lastPlayed,
      avatar: user.avatar,
      gamesPlayed: user.pastGames.length,
    })));
  });

  // Test for deleteTestHandler
  it('should delete a test game for a user', async () => {
    const mockUser = {
      _id: 'userId',
      username: 'testUser',
      sessionId: 'validSessionId',
    };

    const mockGame = {
      user: 'userId',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Game.findOne as jest.Mock).mockResolvedValue(mockGame);

    const response = await request(app)
      .delete('/api/deleteTest')
      .set('username', 'testUser')
      .set('sessionid', 'validSessionId');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'OK, Test successfully deleted');
    expect(mockGame.deleteOne).toHaveBeenCalled();
  });

  // Test for fetchDifficultiesHandler
  it('should fetch difficulty levels for categories', async () => {
    const mockUser = {
      _id: 'userId',
      sessionId: 'validSessionId',
    };

    const mockDifficulties = {
      characters: 1,
      abilities: 3,
      arcs: 2,
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/api/getDifficulties')
      .set('sessionid', 'validSessionId');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('difficulties');
    expect(response.body.difficulties).toEqual(mockDifficulties);
  });
});
