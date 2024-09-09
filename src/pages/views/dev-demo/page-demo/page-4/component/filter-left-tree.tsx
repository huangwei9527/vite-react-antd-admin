import React, { FC, useState, useEffect } from 'react'
import { Tree } from 'antd'
import dayjs from 'dayjs'
import classnames from 'classnames'
import styles from '../index.module.less'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import * as pageConst from '../const'
import { getTableData, getTreeData } from '../store'

export interface IProps {
  [key: string]: any
}
const treeDataMock = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0'
          },
          {
            title: 'leaf',
            key: '0-0-0-1'
          },
          {
            title: 'leaf',
            key: '0-0-0-2'
          }
        ]
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0'
          }
        ]
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          {
            title: 'leaf',
            key: '0-0-2-0'
          },
          {
            title: 'leaf',
            key: '0-0-2-1'
          }
        ]
      }
    ]
  }
]
const Component: FC<IProps> = props => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { filterParams, treeData } = useAppSelector(state => state[pageConst.PAGE_NAME])
  const [selectedKeys, setSelectedKeys] = useState([])

  const onSelect = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys)
    dispatch(getTableData({ treeSelectId: selectedKeys.join() }))
  }

  return (
    <div className={classnames(styles.tableLeftBox)}>
      <div className={styles.bottomBox}>
        <Tree
          className={styles.tree}
          defaultExpandAll={true}
          treeData={treeDataMock}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          virtual={false}
        />
      </div>
    </div>
  )
}

export default Component
