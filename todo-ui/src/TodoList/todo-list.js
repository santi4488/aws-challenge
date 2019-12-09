import React from 'react';
import { Todo } from '../Todo';

export const TodoList = ({todoItems, listAction}) => {
  const todoList = todoItems.map((item) => {
    return (<Todo todoItem={item} key={item.todoId} itemAction={listAction}/>);
  })
  return (
    <div className="list-group">
      {todoList}
    </div>
  )
}