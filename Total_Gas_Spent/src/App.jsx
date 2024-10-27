import { useState,useEffect } from 'react'
import Select from 'react-select'
import config from './config.json';

import './App.css'

function App() 
{
  const ETHapiKey = config.VITE_API_ETHKEY;
  const BaseapiKey = config.VITE_API_BASEKEY;
  const OPapiKey = config.VITE_API_OPKEY;
  const ArbapiKey =config.VITE_API_ARBKEY;
  const LineaapiKey = config.VITE_API_LINEAKEY;
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
      const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${ETHapiKey}`, {signal})
      if(!response.ok)
      throw new Error(`HTTP ERROR! ${response.status}`)
      data = await response.json()
}
if(chain==='Base'){
  const response = await fetch(`https://api.basescan.org/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${BaseapiKey}`, {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
}
if(chain==='Optimism'){
  const response = await fetch(`https://api-optimistic.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${OPapiKey}`,  {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
}
if(chain==='Arbitrum'){
  const response = await fetch(`https://api.arbiscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${ArbapiKey}`,  {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
}
if(chain==='Linea'){
  const response = await fetch(`https://api.lineascan.build/api?module=proxy&action=eth_getTransactionByHash&txhash=${trans[i]}&apikey=${LineaapiKey}`,  {signal})
  if(!response.ok)
  throw new Error(`HTTP ERROR! ${response.status}`)
  data = await response.json()
}
       let gas = parseInt(data.result.gas)
       let gasprice = parseInt(data.result.gasPrice)
       let totalCost = gas*gasprice
       let totalCostEther = totalCost/1e18;
       totalgas = totalgas+totalCostEther;
       console.log(totalgas)
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
  }
  fetchEthPrice()
  getGas()
  return async()=> {
   controller.abort()
  }
  },[transaction])

  const handleSubmit=async()=> {
    console.log('ETH API Key:', config.VITE_API_ETHKEY);
    console.log('Base API Key:', config.VITE_API_BASEKEY);
    console.log('Arbitrum API Key:', config.VITE_API_ARBKEY);
    console.log('Optimism API Key:', config.VITE_API_OPKEY);
    console.log('Linea API Key:', config.VITE_API_LINEAKEY);
       
    setGas(0)
    if(address!=undefined)
    setSecondDiv(true)
  if(chain==='Ethereum'){
  try{
   const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${ETHapiKey}`)

   if(!response.ok)
    throw new Error(`HTTP ERROR! ${response.status}`)
    const data = await response.json()
    setTransaction(data)
    console.log(transaction)
}
   catch (error){
    console.error("fetch error",error)
   }
  }
  if(chain ==='Base'){
    try{
      const response = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${BaseapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
       console.log(transaction)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   if(chain ==='Optimism'){
    try{
      const response = await fetch(`https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${OPapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
       console.log(transaction)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   if(chain ==='Arbitrum'){
    try{
      const response = await fetch(`https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=10000&sort=asc&apikey=${ArbapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
       console.log(transaction)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   if(chain ==='Linea'){
    try{
      const response = await fetch(`https://api.lineascan.build/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=10000&sort=asc&apikey=${LineaapiKey}`)
   
      if(!response.ok)
       throw new Error(`HTTP ERROR! ${response.status}`)
       const data = await response.json()
       setTransaction(data)
       console.log(transaction)
   }
      catch (error){
       console.error("fetch error",error)
      }
   }
   
}

    return (
    <div className={`bg-gray-900 flex h-screen w-screen justify-center items-center `}>
        <div className={`bg-zinc-800 h-1/2 flex flex-col w-1/2 justify-center items-center rounded-lg ${secondDiv?"move-aside":''} ${secondDiv?"ml-20":''} transition-all`
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
          <button className=' font-serif font-semibold text-lg m-2 flex items-center justify-center w-32 h-10 bg-zinc-600 rounded-lg text-gray-200 hover:shadow-md hover:shadow-gray-500'onClick={handleSubmit}>
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
  )
}

export default App
