// 转换orgTree添加树选择组件需要的key
export function transOrgTreeToTreeSelectData(orgTreeData = []) {
  return orgTreeData.map(item => {
    const { children, ...rest } = item
    return {
      ...rest,
      value: item.orgId,
      title: item.orgName,
      children: children ? transOrgTreeToTreeSelectData(children) : []
    }
  })
}
