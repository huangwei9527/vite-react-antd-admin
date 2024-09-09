import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, Space } from 'antd'

const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { loading } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {}, [])

  return <div className={classnames('app-page1', styles.wrapper)}>系统参数 待完善</div>
}

export default withPageSlice(Component, dymaticSlice)
