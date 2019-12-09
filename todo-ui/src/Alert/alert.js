import React from 'react';


export const Alert = ({message, type}) => {
  let alert = '';
  switch (type) {
    default:
      alert = 'alert alert-primary';
      break;
    case 'error':
      alert = 'alert alert-danger';
      break;
    case 'success':
      alert = 'alert alert-success';
  }
  if (message) {
    return (
      <div className={alert}>
        {message}
      </div>
    )
  }
  return (<div></div>);
}