import { useState,useEffect } from 'react'
import Select from 'react-select'

import './App.css'

function App() 
{
const [Value,setValue] = useState([])
const [className, setClassName] = useState('');
const[timeStamp,setTimeStamp] = useState()  
const[TransactionsArray,setTransactionArray] = useState([])
const [showTransactions,setShowTransactions] = useState(false)
const ETHapiKey = import.meta.env.VITE_API_ETHKEY;
const BaseapiKey = import.meta.env.VITE_API_BASEKEY;
const ArbapiKey = import.meta.env.VITE_API_ARBKEY;
const OPapiKey = import.meta.env.VITE_API_OPKEY;
const LineaapiKey = import.meta.env.VITE_API_LINEAKEY;
const [EthPrice,setEthPrice] = useState()
const [Gas,setGas] = useState(0)
const [transaction,setTransaction] = useState(undefined) 
const [address,setAddress] = useState()
const [chain,setChain] = useState("Ethereum")
const [secondDiv,setSecondDiv] = useState(false)
const options =[
    { value: 'Ethereum', label: <><img className='w-5 h-5' src="Ethereum.png" alt="ETH" /> </> },
    { value: 'Base', label: <><img className='w-5 h-5' src="Base.png" alt="Base" /> </> },
    { value: 'Optimism', label: <><img className='w-5 h-5' src="Optimism.png" alt="Optimism" /> </> },
    { value: 'Arbitrum', label: <><img className='w-5 h-5' src="Arbitrum.png" alt="Arbitrum" /> </> },
    { value: 'Linea', label: <><img className='w-5 h-5' src="Linea.png" alt="Arbitrum" /> </> },
  ]
  
  useEffect(()=>{
  const controller = new AbortController()
  const signal = controller.signal
  let transactionArray = []
    const fetchEthPrice = async()=>{
      const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHapiKey}`)
      const data = await response.json()
      setEthPrice(data.result.ethusd)
    }
    const trans = transaction?transaction.result.map(hash=>hash.hash):''
    let totalgas = 0;
    const getGas = async()=>{
      let i;
      for(i=0;i<trans.length;i++){
    try{
      let data
      if(chain==='Ethereum'){
      const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${trans[i]}&apikey=${ETHapiKey}`, {signal})      
      if(!response.ok)
      throw new Error(`HTTP ERROR! ${response.status}`)
      data = await response.json() 
      transactionArray.push(data)
}
if(chain==='Base'){
  const response = await fetch(`https://api.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=${trans[i]}&apikey=${BaseapiKey}`, {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
if(chain==='Optimism'){
  const response = await fetch(`https://api-optimistic.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${trans[i]}&apikey=${OPapiKey}`,  {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
if(chain==='Arbitrum'){
  const response = await fetch(`https://api.arbiscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${trans[i]}&apikey=${ArbapiKey}`,  {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
if(chain==='Linea'){
  const response = await fetch(`https://api.lineascan.build/api?module=proxy&action=eth_getTransactionReceipt&txhash=${trans[i]}&apikey=${LineaapiKey}`,  {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
       let gas = parseInt(data.result.gasUsed)
       let gasprice = parseInt(data.result.effectiveGasPrice)
       let totalCost = gas*gasprice
       let totalCostEther = totalCost/1e18;
       totalgas = totalgas+totalCostEther;
   }
      catch (error){
        if(error.name === 'AbortError'){
          setGas(0)
          console.log('fetch aborted')
          return
        }
       console.error("fetch error",error)
      }
    }
    if(i===trans.length)
    setGas(totalgas)
    setTransactionArray(transactionArray)
  }
  fetchEthPrice()
  getGas()
  return async()=> {
   controller.abort()
  }
  },[transaction])

  const handleSubmit=async()=> {
    setGas(0)
    setValue()
    setTimeStamp()
    setShowTransactions(false)
    if(address!=undefined)
    setSecondDiv(true)
  if(chain==='Ethereum'){
  try{
   const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${ETHapiKey}`)

   if(!response.ok)
    throw new Error(`HTTP ERROR! ${response.status}`)
    const data = await response.json()
    setTransaction(data)
}
   catch (error){
    console.error("fetch error",error)
   }
  }
  if(chain ==='Base'){
    try{
      const response = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${BaseapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   if(chain ==='Optimism'){
    try{
      const response = await fetch(`https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${OPapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   if(chain ==='Arbitrum'){
    try{
      const response = await fetch(`https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=10000&sort=desc&apikey=${ArbapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   if(chain ==='Linea'){
    try{
      const response = await fetch(`https://api.lineascan.build/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=10000&sort=desc&apikey=${LineaapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)

       
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   
}
const handleShowTransactions = async()=>{
  setShowTransactions(!showTransactions)
  const fetchTimeStamp = async()=>{
    let timestamp = []
    let response
    for(let i=0;i<TransactionsArray.length;i++){
    if(chain==='Ethereum')
    response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${TransactionsArray[i].result.blockNumber}&boolean=true&apikey=${ETHapiKey}`)
    if(chain==='Optimism')
    response = await fetch(`https://api-optimistic.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${TransactionsArray[i].result.blockNumber}&boolean=true&apikey=${OPapiKey}`)
    if(chain==='Linea')
    response = await fetch(`https://api.lineascan.build/api?module=proxy&action=eth_getBlockByNumber&tag=${TransactionsArray[i].result.blockNumber}&boolean=true&apikey=${LineaapiKey}`)
    if(chain==='Arbitrum')
    response = await fetch(`https://api.arbiscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${TransactionsArray[i].result.blockNumber}&boolean=true&apikey=${ArbapiKey}`)
    if(chain==='Base')
    response = await fetch(`https://api.basescan.org/api?module=proxy&action=eth_getBlockByNumber&tag=${TransactionsArray[i].result.blockNumber}&boolean=true&apikey=${BaseapiKey}`) 
    if(!response.ok)
    throw new Error(`HTTP ERROR! ${response.status}`)
    const data2 = await response.json()
    timestamp.push(data2.result.timestamp)
    console.log(data2)
  }

  setTimeStamp(timestamp)
  }
  fetchTimeStamp()
}

useEffect(() => {
  if (!showTransactions) {
    const timer = setTimeout(() => {
      setClassName('overflow-hidden'); // Set the desired class after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount or when showTransactions changes
  } else {
    setClassName(''); // Reset the class when showTransactions is true
  }
}, [showTransactions]);

useEffect(() => {
const fetchValue = async()=>{
    let transactionArray = []
    const trans = transaction?transaction.result.map(hash=>hash.hash):''
      let i;
      for(i=0;i<trans.length;i++){
    try{
      let data
      if(chain==='Ethereum'){
      const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${ETHapiKey}`)      
      if(!response.ok)
      throw new Error(`HTTP ERROR! ${response.status}`)
      data = await response.json()
      console.log(data) 
      transactionArray.push(data)
}
if(chain==='Base'){
  const response = await fetch(`https://api.basescan.org/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${BaseapiKey}`)
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
if(chain==='Optimism'){
  const response = await fetch(`https://api-optimistic.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${OPapiKey}`)
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
if(chain==='Arbitrum'){
  const response = await fetch(`https://api.arbiscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${ArbapiKey}`)
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
if(chain==='Linea'){
  const response = await fetch(`https://api.lineascan.build/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${LineaapiKey}`)
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
  transactionArray.push(data)
}
   }
      catch (error){
       console.error("fetch error",error)
    }
  }
  setValue(transactionArray)
}
  fetchValue()
},[TransactionsArray])

    return (
      <div className={`${showTransactions?"move-up":'move-down'} h-screen ${className}`} 
      >
    <div className={`bg-[#111827] flex flex-col h-screen w-screen justify-center items-center`}>
        <h1 className='text-white font-semibold font-mono text-2xl mt-10 underline underline-offset-[16px] decoration-dashed decoration-[#6b7280] border-x-2 border-t-2 border-[#6b7280] p-2'>Calculate Your Total Gas Expenditure</h1>
      <div className={`bg-[#111827] flex h-full w-full justify-center items-center `}>
        <div className={`bg-[#27272a] h-[50vh] flex flex-col w-[50vw] justify-center items-center rounded-lg  ${secondDiv?"move-aside":''} ${secondDiv?"ml-20":''} transition-all`
      } style={{}}>
        <div className='flex justify-center items-center'>
        <div className='flex flex-col'>
        <label className='text-white font-serif font-semibold' 
          htmlFor='address' 
          >Wallet Address</label>
          <input className='text-clip p-2 rounded-md m-2 -ml-1'
          name='address'
          id='address'
          onChange={(e)=> setAddress(e.target.value)}
          placeholder='Enter your address'
          ></input>
          </div>
          <Select 
          name = 'chain'
          id = 'chain'
          defaultValue={options[0]}
          onChange={(e)=> setChain(e.value) }
          className='mt-6' options={options} />
          </div>
          <div className=''>
          <button className=' font-serif font-semibold text-lg m-2 flex items-center justify-center w-32 h-10 bg-[#52525b] rounded-lg text-gray-200 hover:shadow-md hover:shadow-gray-500'onClick={handleSubmit}>
            Submit
          </button>
          </div>
        </div>
        {secondDiv &&
        (
          <div className="second-div text-white">
          <h1 className='text-clip'>Wallet Address: {address}</h1>
          <div className='flex mt-2'>
          <p className='mr-2'>{`Chain:`}</p>
          <p className='mr-1'>{`${chain}`}</p>
          <img className='h-5 w-5'src={`${chain}.png`}></img>
          </div>
          <h1 className='mt-2'>Total Transactions:  {transaction?transaction.result.length:"..."}</h1>
          <h1 className='mt-2 flex items-center'>Total gas spent in ETH:  {Gas!=0?`${Gas.toPrecision(5)} ETH`:(<img className='ml-4 aspect-video h-8 ' src='https://i.gifer.com/ZWdx.gif' alt='Calculating...'></img>)}</h1>
          <h1 className='mt-2 flex items-center'>Total gas spent in USD:  {Gas!=0?`${(Gas*EthPrice).toPrecision(7)} USD`:(<img className='ml-[14px] aspect-video h-8' src='https://i.gifer.com/ZWdx.gif' alt='Calculating...'></img>)}</h1>
        </div>
        )
      }
        </div>
        {Gas!=0 && <button className={`${showTransactions?'w-40 h-10 text-2xl':''} button1 text-white text-xl font-serif ${Value?'hover:underline':''} ${Value?'hover:underline-offset-4':''} ${Value?'hover:text-blue-600':''}`}
        style={{transition:'fadeIN 2s'}}
        onClick={Value?handleShowTransactions:undefined}
        >{Value?showTransactions?"Click here to hide transactions":"Click here to show transactions":"Fetching Your Transaction Please Wait..."}</button>
        }
    </div>
    { transaction && TransactionsArray && (<div className={` ${showTransactions?'goOpaque':'goTransparent'} flex border-y-2 justify-center items-center text-white`}>
      <div className='flex flex-col pb-2  border-x-2 px-6 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold w-30 ml-4'>Transaction</h1>
      {transaction.result.map((hash,index)=><p key={index} className='my-2'>{index+1}</p>)}
    </div>
      <div className='flex flex-col pb-2   border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold '>Transaction Hash</h1>
      {transaction.result.map((hash,index)=><p key={index} className='my-2 w-60 overflow-hidden text-ellipsis whitespace-nowrap'>{hash.hash}</p>)}
    </div>
    <div className='flex flex-col pb-2   border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold'>From</h1>
      {transaction.result.map((hash,index)=><p key={index} className='my-2 w-40 overflow-hidden text-ellipsis whitespace-nowrap'>{TransactionsArray[index]?.result.from}</p>)}
    </div>
    <div className='flex flex-col pb-2  border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold'>To</h1>
      {transaction.result.map((hash,index)=><p key={index} className={TransactionsArray[index]?.result.to?'my-2 w-40 overflow-hidden text-ellipsis whitespace-nowrap':'my-2 w-40 overflow-hidden text-center text-ellipsis whitespace-nowrap'}>{TransactionsArray[index]?.result.to?TransactionsArray[index]?.result.to:'-'}</p>)}
    </div>
    <div className='flex flex-col pb-2  border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold whitespace-nowrap text-center w-36 -ml-4'>Trx Value(USD)</h1>
      {transaction.result.map((hash,index)=><p key={index} 
      className={'text-center my-2 w-20 overflow-hidden text-ellipsis -ml-2 whitespace-nowrap'}>
        {Value? ((parseInt(Value[index]?.result?.value)/1e18)*EthPrice).toFixed(5):"Fetching..."}
      </p>)}
    </div>
    <div className='flex flex-col pb-2  border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold w-40'>Gas used in USD</h1>
      {transaction.result.map((hash,index)=><p key={index} className='my-2 w-20 overflow-hidden text-ellipsis whitespace-nowrap'>{((parseInt((TransactionsArray[index]?.result.gasUsed)*parseInt(TransactionsArray[index]?.result.effectiveGasPrice))/1e18)*EthPrice).toFixed(5)}</p>)}
    </div>
    <div className='flex flex-col pb-2  border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold w-40'>Gas used in ETH</h1>
      {transaction.result.map((hash,index)=><p key={index} className='my-2 w-20 text-ellipsis whitespace-nowrap'>{(parseInt((TransactionsArray[index]?.result.gasUsed)*parseInt(TransactionsArray[index]?.result.effectiveGasPrice))/1e18).toFixed(5)<0.00001?"<0.00001":(parseInt((TransactionsArray[index]?.result.gasUsed)*parseInt(TransactionsArray[index]?.result.effectiveGasPrice))/1e18).toFixed(5)}</p>)}
    </div>
    <div className='flex flex-col pb-2 border-r-2 px-2 justify-center items-center mr-4'>
      <h1 className='my-2 font-mono font-semibold mr-2'>TimeStamp</h1>
      {transaction.result.map((hash,index)=><p key={index} className='my-2 w-40 overflow-hidden text-ellipsis whitespace-nowrap mr-4'>{timeStamp? (new Date(parseInt(timeStamp[index],16)*1000)).toLocaleString("en-GB",{hour12:false}):"Fetching..."}</p>)}
    </div>
    </div>)}
    </div>
  )
}

export default App
