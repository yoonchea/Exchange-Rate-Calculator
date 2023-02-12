import React, { useEffect, useState } from 'react';
import './App.css';
import { CgArrowsExchangeV } from 'react-icons/cg'
import Body from './Body';

// API URL 변수에 저장
const API_URL = `https://api.exchangerate.host/latest`;                     

const App = () => {

  const [nationOptions, setNationOptions] = useState([]);         // select 태그 안의 option 태그 value값으로 주기위해(국가별)
  const [mainInput, setMainInput] = useState();                   // 첫번째 input state
  const [subInput, setSubInput] = useState();                     // 두번째 input state
  const [exchangeRate, setExchangeRate] = useState(1)             // exchange rate state(환율), 기본값: 1로 설정
  const [amount, setAmount] = useState(0);                        // input value state(금액 입력)
  const [isChange, setIsChange] = useState(true);                 // 업데이트 해야 할 것을 알려준 후 환율 확인하는 state
 
  // 어떤 변수가 어떤 값으로 설정되어 있는지 파악하기 위해 따로 변수 선언
  let subAmount, mainAmount;              
  
  // 조건문을 통해 ,
  // 참이면 첫번째 input창이 mainAmount가 되고 두번째 input 창에 환율을 곱한 가격
  // 거짓이면 두번째 input창이 mainAmount가 되고 첫번째 input 창에 환율을 곱한 가격
  if (isChange) {                          
    mainAmount = amount;                   
    subAmount = amount * exchangeRate;
  } else {
    subAmount = amount;
    mainAmount = amount / exchangeRate;
  } 
  
  

  
  // API 호출(처음 마운트 될때 API 호출하기 위해 useEffect사용)
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const firstNation = Object.keys(data.rates)[0]            // 객체의 0번째 값을 받아서 변수에 저장
        setNationOptions([data.base, ...Object.keys(data.rates)]) //순회하며 객체의 key값들만 배열로 반환
        setMainInput(data.base)  
        setSubInput(firstNation)
        setExchangeRate(data.rates[firstNation]) // 실제 환율
      }) 
  }, [])
  
  // 다른나라 옵션을 한번 더 클릭 하였을때 리렌더링
  // if문을 통해 null 예외처리
  useEffect(() => {
    if(mainInput != null && subInput !== null) {
      fetch(`${API_URL}?base=${mainInput}&symbols=${subInput}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[subInput]))
    }
  }, [mainInput, subInput]) // 두 개의 값이 변경될 때 렌더(deps)

  const handleMainChangeAmount = (e) => {
    setAmount(e.target.value)
    setIsChange(true)
  }
  const handleSubChangeAmount = (e) => {
    setAmount(e.target.value)
    setIsChange(false)
  }

  return (
    <>
      <h1 className='title'>환율 계산기</h1>
      <Body
       nationOptions={nationOptions} 
       selectNation={mainInput} 
       onChangeNation={e => setMainInput(e.target.value)} // select option에 대해 수행하는 함수(e.target.value를 통해)
       onChangeAmount={handleMainChangeAmount} 
       amount={mainAmount} 
      />
      <CgArrowsExchangeV className='icon' />
      <Body
       nationOptions={nationOptions} 
       selectNation={subInput} 
       onChangeNation={e => setSubInput(e.target.value)} // select option에 대해 수행하는 함수(e.target.value를 통해)
       onChangeAmount={handleSubChangeAmount} 
       amount={subAmount} 
      />
    </>
  );
}

export default App;
