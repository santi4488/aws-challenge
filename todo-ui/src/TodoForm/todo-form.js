import React from 'react';

export const TodoForm = ({addTodo}) => {
  let input;

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      addTodo(input.value);
      input.value = '';
      }}>
      <div className="input-group">
        <input placeholder="New Todo Item" className="form-control" ref={node => { input = node; }}/>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary">
            Add
          </button>
        </div>
      </div>
    </form>
  );
};