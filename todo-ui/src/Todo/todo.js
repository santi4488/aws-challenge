import React from 'react';

export const Todo = ({todoItem, itemAction}) => {
  return (
    <a href="#" className="list-group-item list-group-item-action" onClick = {() => {
      if (itemAction) {
        itemAction(todoItem.todoId)
      }
    }}>
      {todoItem.title}
    </a>
  )
}