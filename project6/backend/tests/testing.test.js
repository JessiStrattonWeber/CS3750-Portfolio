const request = require('supertest');
const app = require('../server');
const dbo = require('../db/conn');

let db;
let testEmail;
let insertedId;

/*********************************************************************
 *                            SETUP
**********************************************************************/
beforeAll(done => {
  dbo.connectToServer(() => {
    db = dbo.getDb();
    testEmail = 'jessi@testing.com';
    done();
  });
});

/*********************************************************************
 *                            ADD RECORD
**********************************************************************/
describe('/record/add', () => {

  it('should add a record to the database', async () => {

    const response = await request(app).post('/record/add').send({
      first_name: 'Jessi',
      last_name: 'Stratton',
      email: testEmail,
      phone: '1234567890',
      password: 'password',
      role: 'admin',
    });

    insertedId = response.body.id;

    //Make sure that the record does exist 
    const insertedRecord = await db.collection('records').findOne({ id: parseInt(insertedId) });
    expect(insertedRecord).not.toBeNull();

    expect(insertedRecord.email).toBe(testEmail);
  });

  //Check that password was hashed. 
  it('should hash the password correctly', async () => {
    const insertedRecord = await db.collection('records').findOne({ id: parseInt(insertedId) });

    const expectedHash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
    expect(insertedRecord.password).toBe(expectedHash);
  });
});

/*********************************************************************
 *                            LOGIN 
**********************************************************************/
describe('/login', () => {
  it('should be able to successfully login', async () => {

    const response = await request(app).post('/login').send({
      email: testEmail,
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successful login');

  });
});

/*********************************************************************
 *                            DEPOSIT
**********************************************************************/
describe('/deposit', () => {

  //Test a money deposit
  it('should deposit money correctly', async () => {
    const response = await request(app).post('/deposit').send({
      rule: 'testing',
      id: insertedId,
      account: 'checking',
      amount: 10000,
    });

    // Deposit works
    expect(response.status).toBe(200);

    //Number is correct 
    const updatedRecord = await db.collection('records').findOne({ id: parseInt(insertedId) });
    expect(updatedRecord.checking).toBe(10000);
  });

  //Test that negative deposits don't work
  it('should not deposit a negative amount', async () => {
    const response = await request(app).post('/deposit').send({
      rule: 'testing',
      id: insertedId,
      account: 'checking',
      amount: -10000,
    });

    // Denied :p
    expect(response.status).toBe(401);
  });
});

/*********************************************************************
 *                            WITHDRAW
**********************************************************************/
describe('/withdraw', () => {
  // Test a money withdrawal
  it('should withdraw money correctly', async () => {

    const response = await request(app).post('/withdraw').send({
      rule: 'testing',
      id: insertedId,
      account: 'checking',
      amount: 5000,
    });

    // Withdraw works
    expect(response.status).toBe(200);

    // Number is correct 
    const updatedRecord = await db.collection('records').findOne({ id: parseInt(insertedId) });
    expect(updatedRecord.checking).toBe(5000);
  });

  // Test that overdraft withdrawals don't work
  it('should not withdraw more money than is in account', async () => {
    const response = await request(app).post('/withdraw').send({
      rule: 'testing',
      id: insertedId,
      account: 'checking',
      amount: 500000,
    });

    // Denied again !
    expect(response.status).toBe(401);
  });

  // Can't withdrawals a negative amount 
  it('should not withdraw a negative amount', async () => {
    const response = await request(app).post('/withdraw').send({
      rule: 'testing',
      id: insertedId,
      account: 'checking',
      amount: -1000,
    });

    // Ultra denied :p
    expect(response.status).toBe(401);
  });
});

/*********************************************************************
 *                            LOOKUP 
**********************************************************************/
describe('/lookup', () => {
  it('should successfully find the test record', async () => {
    const response = await request(app).post('/lookup').send({
      rule: 'testing',
      id: insertedId,
    });

    //Correct record is returned. 
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', testEmail);
  });

  // Test a lookup with an invalid id
  it('should return an error when record does not exist.', async () => {
    const response = await request(app).post('/lookup').send({
      rule: 'testing',
      id: 12345,
    });

    expect(response.status).toBe(404);
  });
});

/*********************************************************************
 *                           EDIT A RECORD 
**********************************************************************/
describe('/record/update/:id', () => {

  // Test successful update
  it('should update record correctly', async () => {

    const response = await request(app).post(`/record/update/${insertedId}`).send({
      first_name: 'Jessica',
      last_name: 'Smagghe',
      phone: '1112223333',
      role: 'employee'
    });

    expect(response.status).toBe(200);

    // Verify that everything updated 
    const updatedRecord = await db.collection('records').findOne({ id: parseInt(insertedId) });
    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord.first_name).toBe('Jessica');
    expect(updatedRecord.last_name).toBe('Smagghe');
    expect(updatedRecord.phone).toBe('1112223333');
    expect(updatedRecord.role).toBe('employee');
  });
});

/*********************************************************************
 *                            CLEANUP 
**********************************************************************/
afterAll(async () => {
  if (insertedId) {
    await db.collection('records').deleteOne({ id: parseInt(insertedId) });
  }
  await dbo.closeConnection();
});
