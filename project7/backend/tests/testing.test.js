const request = require('supertest');
const app = require('../server');
const dbo = require('../db/conn');

let db;
let testEmail;
let insertedId;

beforeAll(done => {
  dbo.connectToServer(() => {
    db = dbo.getDb();
    testEmail = 'jessi@testing.com';
    done();
  });
});

//Begining test code template. 
describe('Sample Test', () => {
  it('should return "Passed test"', async () => {
    const response = await request(app).get('/testing');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Passed test');
  });
});

describe('/record/add', () => {

  it('should add a record to the database', async () => {
    const jessi = {
      first_name: 'Jessi',
      last_name: 'Stratton',
      email: testEmail,
      phone: '1234567890',
      password: 'password',
      role: 'admin',
    };

    const response = await request(app)
      .post('/record/add')
      .send(jessi);

    insertedId = response.body.id;

    //Make sure that the record does exsist 
    const insertedRecord = await db.collection('records').findOne({ id: parseInt(insertedId) });
    expect(insertedRecord).not.toBeNull();

    expect(insertedRecord.email).toBe(testEmail);
    expect(insertedRecord.first_name).toBe(jessi.first_name);
    expect(insertedRecord.last_name).toBe(jessi.last_name);
  });

  //Check that password was hashed. 
  it('should hash the password correctly', async () => {
    const insertedRecord = await db.collection('records').findOne({  id: parseInt(insertedId) });

    const expectedHash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
    expect(insertedRecord.password).toBe(expectedHash);
  });
});

// Clean up after tests
afterAll(async () => {
  if (insertedId) {
    await db.collection('records').deleteOne({ id: parseInt(insertedId) });
  }
  await dbo.closeConnection();
});
