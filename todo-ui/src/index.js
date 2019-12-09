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
      todos: {
        todo: [],
        done: []
      }
    };
    this.apiUrl = 'https://w9lrq492i0.execute-api.us-east-2.amazonaws.com/Stage';
  }

  componentDidMount() {
    fetch(`${this.apiUrl}/todos`)
      .then((res => res.json()))
      .then((items) => {
        console.log(items);
        this.setState({
          ...this.state,
          todos: {
            todo: items.todos.filter((item) => {
              return item.status === 'todo';
            }),
            done: items.todos.filter((item) => {
              return item.status === 'done';
            })
          }
        });
      })
      .catch((err) => {
        console.error(err);
      })
  }

  addTodo(newTodo) {
    fetch(`${this.apiUrl}/todos`, {
      mode: 'no-cors',
      method: 'POST',
      body: JSON.stringify({
        title: newTodo,
        status: 'todo'
      })
    })
  }

  completeTodo (id) {
    this.setState({
      todos: {
        todo: this.state.todos.todo.filter((t) => {
          return t.todoId !== id;
        }),
        done: [
          ...this.state.todos.done,
          ...this.state.todos.todo.filter((t) => {
            return t.todoId === id;
          })
        ]
      }
    });
  }

  deleteTodo (id) {
    
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
            <TodoList todoItems={this.state.todos.todo} listAction={this.completeTodo.bind(this)}/>
          </div>
          <div className="col-sm">
            <h4>Done</h4>
            <TodoList todoItems={this.state.todos.done}/>
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(<TodoApp/>, document.getElementById('root'));
