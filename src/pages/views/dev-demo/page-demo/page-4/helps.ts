/**
 * 转换成tree组件需要的数据结构
 * @param rows 
 */
export const handleTransformTree = rows => {
  const fn = (arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      let nodeData = arr[i]
      arr[i] = {
        ...nodeData,
        key: nodeData.id,
        title: nodeData.name,
        isLeaf: !(nodeData.children?.length > 0)
      }
      if (arr[i].children) {
        fn(arr[i].children)
      }
    }
  }
  fn(rows)
}
