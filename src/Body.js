import React from 'react'

const Body = ({ nationOptions, selectNation, onChangeNation, amount, onChangeAmount }) =>  {
  return (
    <div>
      <input className='input' type="number" value={amount} onChange={onChangeAmount} />
      <select className='select' value={selectNation} onChange={onChangeNation}>
        {nationOptions.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default Body;

