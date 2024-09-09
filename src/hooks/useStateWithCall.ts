/**
 * 使用实例
 *    const [test,setTest] = useStateWithCall(-1);
 *    // 设置新数据 回调方式
 *    setTest(1,(newState)=>{
 *        console.log("新值"+newState)
 *    })
 *  // promise方式
 * setTest(type).then((newState)=>{
        console.log("新值"+newState)
    })
 *
 */

import { useRef, useState, useEffect } from 'react'

const useStateWithCall = initValue => {
  const ref = useRef(0)
  const callFRef = useRef(null)
  const setFuncRef = useRef(null)
  let [state, setState] = useState(initValue)
  if (!ref.current) {
    ref.current = 1
    setFuncRef.current = (newData, callF) => {
      callFRef.current = callF
      setState(newData)
      return Promise.resolve(newData)
    }
  }
  useEffect(() => {
    callFRef.current?.(state)
  }, [state])
  return [state, setFuncRef.current]
}

export default useStateWithCall
