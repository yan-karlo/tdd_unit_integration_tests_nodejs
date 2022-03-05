const request = require('supertest');
const app = require('../../app');

const newTodo = require('../mock-data/new-todo.json');
let newTodoId = '';
const endPoint = '/todos/';
let firstTodo = '';


describe(endPoint, () => {
  test("GET " + endPoint, async () => {
    const response = await request(app).get(endPoint);
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[1];
  })

  test("GET by Id " + endPoint + ":todoId", async () => {
    const response = await request(app).get(endPoint + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  })

  test('GET todoId that doesnt exist', async() => {
    // const response = await request(app).get(endPoint + firstTodo._id+'1');
    const response = await request(app).get(endPoint + '621bbd1219319423ef6c3687');
    expect(response.statusCode).toBe(404);
  })
  it("POST " + endPoint, async () => {
    const response = await request(app)
      .post(endPoint)
      .send(newTodo)

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });

  //In this test the server must be running
  it('It should return error 500 on malformed data on POST ' + endPoint, async () => {
    const response = await request(app)
      .post(endPoint)
      .send({ title: 'Done property is missing' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({ message: 'Todo validation failed: done: Path `done` is required.' });
  })

  it('PUT ' + endPoint + ':todoId', async () => {
    const testData = { title: 'Integration Test for PUT', done: true };
    const response = await request(app).put(endPoint + newTodoId).send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  })
  it('DELETE ' + endPoint + ':todoId', async () => {
    //console.log(newTodoId);
    const response = await request(app).delete(endPoint + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  })
})