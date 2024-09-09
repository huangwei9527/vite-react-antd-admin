/**
 * await 包装函数
 * @return {Array} 包装结果的数组
 * @param promise {Promise} promise对象
 * */
const awaitWrapper = <T>(promise: Promise<T>) => {
  return promise.then(v => [null, v] as const).catch(e => [e, null] as const)
}

export default awaitWrapper

/*
 * 捕获结果 返回值为数组，
 * 数组的第一个元素为error，
 * 当promise函数resolve的时候为空，
 * 第二个元素为success result，
 * 当promise函数reject的时候为空
 * 示例：
 * 
  const [bufferError, buffer] = await awaitWrapper(getFileBuffer(url))
  if (bufferError) return bufferError
  // 其他操作

 */
