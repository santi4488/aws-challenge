import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { TodoForm } from "./TodoForm";
import { TodoList } from './TodoList/todo-list';

class TodoApp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      items: [],
      todo: [],
      done: []
    };
    this.apiUrl = 'https://w9lrq492i0.execute-api.us-east-2.amazonaws.com/Stage';
  }

  componentDidMount() {
    fetch(`${this.apiUrl}/todos`)
      .then((res => res.json()))
      .then((items) => {
        this.setState({
          ...this.state,
          items: items.todos,
          todo: items.todos.filter((item) => {
            return item.status === 'todo';
          }),
          done: items.todos.filter((item) => {
            return item.status === 'done';
          })
        });
      })
      .catch((err) => {
        console.error(err);
      })
  }

  addTodo(newTodo) {
    const newId = this.state.items.reduce((max, item) => {
      return parseInt(item.todoId) > max ? parseInt(item.todoId) : max;
    }, 1) + 1;
    fetch(`${this.apiUrl}/todos`, {
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({
        todoId: newId,
        title: newTodo,
        status: 'todo'
      })
    })
      .then((res) => res.json())
      .then((newItem) => {
        this.setState({
          ...this.state,
          items: [
            ...this.state.items,
            newItem
          ],
          todo: [
            ...this.state.todo,
            newItem
          ]
        });
      })
      .catch((err) => {
        console.error(err);
      })
  }

  completeTodo (id) {
    const todo = this.state.todo.find((item) => {
      return item.todoId === id;
    });
    fetch(`${this.apiUrl}/todos/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({
        title: todo.title,
        status: 'done'
      })
    }).then((res) => res.json())
    .then((item) => {
      this.setState({
        todo: this.state.todo.filter((t) => {
          return t.todoId !== id;
        }),
        done: [
          ...this.state.done,
          ...this.state.todo.filter((t) => {
            return t.todoId === id;
          })
        ]
      });
    }, (err) => {
      console.error(err);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  deleteTodo (id) {
    fetch(`${this.apiUrl}/todos/${id}`, {
      method: 'DELETE'
    })
    .then((res) => {
      this.setState({
        ...this.state,
        items: this.state.items.filter((item) => {
          return item.todoId !== id;
        }),
        done: this.state.done.filter((item) => {
          return item.todoId !== id;
        })
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="container">
        <h1>My Todo List</h1>
        <hr/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <div className="row">
          <div className="col-sm">
            <h4>Todo</h4>
            <TodoList todoItems={this.state.todo} listAction={this.completeTodo.bind(this)}/>
          </div>
          <div className="col-sm">
            <h4>Done</h4>
            <TodoList todoItems={this.state.done} listAction={this.deleteTodo.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(<TodoApp/>, document.getElementById('root'));
