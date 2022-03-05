const TodoModel = require('../models/todo.model');

exports.createTodo = async (req, res, next) => {
  try{
    const newTodo =  await TodoModel.create(req.body);
    return res.status(201).json(newTodo);

  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    return res.status(200).json(allTodos);
  } catch (error) {
    next(error);
  }
}

exports.getTodoById = async (req, res, next) => {
  const {todoId} = req.params;
  try {
    const todo = await TodoModel.findById(todoId);
    if(!todo)
      res.status(404).json();
    else
      res.status(200).json(todo);

  } catch (error) {
    next(error);
  }
}

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      {
        new: true,
        useFindAndModify: false
      });
    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send();
    }

  } catch (error) {
    next(error);
  }
}

exports.deleteTodo = async (req, res, next) => {
  const { todoId } = req.params;
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
    if(!deletedTodo)
      res.status(404).json();
    else
      res.status(200).json(deletedTodo);

  } catch (error) {
    next(error);
  }
}


exports.ping = () => res.status(200).json('pong');