const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http'); // it mocks http requests

const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
jest.mock('../../models/todo.model.js'); // mock all mongoose methods at once

let req, res, next;
let todoId = '621bbce54b87220a1668bd33';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn()
});
describe("TodoController.deleteTodo", () => {
  it('Should have TodoController.deleteTodo function', async () => {
    expect(typeof TodoController.deleteTodo).toBe('function');
  })
  it('Should delete with TodoModel.findByIdAndDelete', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;

    await TodoController.deleteTodo(req, res, next);

    expect(TodoModel.findByIdAndDelete)
      .toHaveBeenCalledWith(todoId);
  })
  it('Should return a response with status code 200', async () => {
    req.params.todoId = todoId;
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);

    await TodoController.deleteTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  })
  it('Should handle errors', async () => {
    const errorMessage = { message: "Done property is missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);

    await TodoController.deleteTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  })
  it('Should return 404 when item does not exist', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
})
describe("TodoController.updateTodo", () => {
  it('Should have TodoController.updateTodo function', async () => {
    expect(typeof TodoController.updateTodo).toBe('function');
  })
  it('Should update with TodoModel.findByIdAndUpdate', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;

    await TodoController.updateTodo(req, res, next);

    expect(TodoModel.findByIdAndUpdate)
      .toHaveBeenCalledWith(
        todoId,
        req.body,
        {
          new: true,
          useFindAndModify: false
        });
  })
  it('Should return a response with status code 200', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);

    await TodoController.updateTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  })
  it('Should handle errors', async () => {
    const errorMessage = { message: "Done property is missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

    await TodoController.updateTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  })
  it('Should return 404 when item does not exist', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();

  })
})
describe('TodoController.getTodoById', () => {
  it('It should have getTodoBy function', () => {
    expect(typeof TodoController.getTodoById).toBe('function');
  })

  it('Should call findById with route parameters', () => {
    req.params.todoId = '621bbcd5198628f8a4485007'
    TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith('621bbcd5198628f8a4485007');
  })

  it('Should return a JSON object and status code response 200', async () => {
    TodoModel.findById.mockReturnValue(newTodo);

    await TodoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  })

  it('Should handle errors', async () => {
    const errorMessage = { message: "Done property is missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.findById.mockReturnValue(rejectedPromise);

    await TodoController.getTodoById(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  })

  it('Should return 404 when item does not exist', async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();

  })
})

describe('TodoController.getTodos', () => {
  it('Should have a getTodos Function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  })

  it('shuld call TodoModel.find.', () => {
    TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toBeCalled();
    expect(TodoModel.find).toBeCalledWith({});
    expect(TodoModel.find).toHaveBeenCalledWith({});
  })

  it('Should return a 200 status code', async () => {
    TodoModel.find.mockReturnValue(allTodos);

    await TodoController.getTodos(req, res, next)

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  })

  it('Should handle errors', async () => {
    const errorMessage = { message: "Done property is missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.find.mockReturnValue(rejectedPromise);

    await TodoController.getTodos(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  })

})

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo;
  });
  it('Should have a createTodo Function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  })

  it('shuld call TodoModel.create.', () => {
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  })

  it('Should return a 201 status code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  })

  it('It should return a response JSON body in response', async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo); //toBe() would apoint for different objets in the memory and return would be always false
  })

  it('Should handle errors', async () => {
    const errorMessage = { message: "Done property is missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })
})