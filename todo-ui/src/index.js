import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { TodoForm } from "./TodoForm";
import { TodoList } from './TodoList/todo-list';
import { Alert } from './Alert';

class TodoApp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      alert: {
        message: null,
        type: null
      },
      items: [],
      todo: [],
      done: []
    };
    this.apiUrl = ''; // your aws base url goes here
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
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return res.json()
          .then((err) => {
            return Promise.reject(err);
          });
      })
      .then((newItem) => {
        this.setState({
          ...this.state,
          alert: {
            message: `${newTodo} added successfully`,
            type: 'success'
          },
          items: [
            ...this.state.items,
            newItem
          ],
          todo: [
            ...this.state.todo,
            newItem
          ]
        });
        setTimeout(() => {
          this.setState({
            ...this.state,
            alert: {
              message: null
            }
          });
        }, 3000)
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          ...this.state,
          alert: {
            message: err.message,
            type: 'error'
          }
        });
        setTimeout(() => {
          this.setState({
            ...this.state,
            alert: {
              message: null
            }
          });
        }, 3000)
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
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return res.json()
        .then((err) => {
          return Promise.reject(err);
        });
    })
    .then((item) => {
      console.log(item)
      this.setState({
        alert: {
          message: `${item.title} updated successfully`,
          type: 'success'
        },
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
      setTimeout(() => {
        this.setState({
          ...this.state,
          alert: {
            message: null
          }
        });
      }, 3000)
    })
    .catch((err) => {
      this.setState({
        ...this.state,
        alert: {
          message: err.message,
          type: 'error'
        }
      });
      setTimeout(() => {
        this.setState({
          ...this.state,
          alert: {
            message: null
          }
        });
      }, 3000)
    });
  }

  deleteTodo (id) {
    fetch(`${this.apiUrl}/todos/${id}`, {
      method: 'DELETE'
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return res.json()
        .then((err) => {
          return Promise.reject(err);
        });
    })
    .then((res) => {
      this.setState({
        ...this.state,
        alert: {
          message: 'Item deleted successfully',
          type: 'success'
        },
        items: this.state.items.filter((item) => {
          return item.todoId !== id;
        }),
        done: this.state.done.filter((item) => {
          return item.todoId !== id;
        })
      });
      setTimeout(() => {
        this.setState({
          ...this.state,
          alert: {
            message: null
          }
        });
      }, 3000);
    })
    .catch((err) => {
      this.setState({
        ...this.state,
        alert: {
          message: err.message,
          type: 'error'
        }
      });
      setTimeout(() => {
        this.setState({
          ...this.state,
          alert: {
            message: null
          }
        });
      }, 3000);
    });
  }

  render() {
    return (
      <div className="container">
        <h1>My Todo List</h1>
        <hr/>
        <Alert message={this.state.alert.message} type={this.state.alert.type}/>
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
