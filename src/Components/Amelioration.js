import React from 'react';

function Amelioration(props) {
  return (
    <div className='place-self-end m-auto'>
      <h3 className='text-center'>Amélioration : </h3>
      <p className='text-center'>{props.ameliorationDescription}</p>
    </div>
  );
}

export default Amelioration;
