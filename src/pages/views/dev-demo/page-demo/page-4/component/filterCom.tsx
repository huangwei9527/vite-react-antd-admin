import React, { FC, useEffect, useState } from 'react'
import { Input, Dropdown, Button, DatePicker, Checkbox, Select, Tooltip, Space } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import FilterFold from '@/components/filter-fold/index'
import FilterItem from '@/components/filter-item/index'
import { FoldVertical, FoldVerticalItem } from '@/components/filter-fold-vertical/index'
import { FilterItemCheckbox, FilterItemSelect, FilterItemTextInput } from '@/components/filter-item-components'
import { defaultFilterParams, getTableData, setFilterParams } from '../store'
import { PAGE_NAME } from '../const'
import FilterRefresh from '@/components/filter-refresh'
import FilterItemSelectSearch from '@/components/filter-item-select-search/index'
import { isEqual } from 'lodash'
import styles from '../index.module.less'
import classnames from 'classnames'
import * as pageConst from '../const'
import dayjs from 'dayjs'
import { isEqualObject } from '@/utils/util'

interface IProps {
  [key: string]: any
}

const ml12 = { marginLeft: '12px' }
const filterItemStyle = { width: '100%' }
const { Option } = Select

const FilterCom: FC<IProps> = props => {
  const dispatch = useAppDispatch()
  const [hasFilter, setHasFilter] = useState(false)
  const { systemInitData } = useAppSelector(store => store.app)
  const { tableParams, filterParams } = useAppSelector(store => store[PAGE_NAME])

  const compareFilters = (liveCurFilter: any) => {
    setHasFilter(!isEqualObject(defaultFilterParams, liveCurFilter, ['page', 'pageSize', 'fromPeriod', 'toPeriod', 'value1']))
  }

  const filtersChange = (opt: any) => {
    const params = { ...filterParams, ...opt }
    compareFilters(params)
    dispatch(setFilterParams(params))
  }

  const handleReset = () => {
    //  重置所有查询条件
    const params = {
      ...defaultFilterParams,
      value1: filterParams.value1,
      fromPeriod: filterParams.fromPeriod,
      toPeriod: filterParams.toPeriod
    }
    setHasFilter(false)
    dispatch(getTableData(params))
  }

  const filterItem = [
    <FilterItemSelect
      foldMode="vertical"
      label="现金流量项"
      labelWidth={80}
      value={filterParams.value2}
      onChange={val => filtersChange({ value2: val })}
      options={[
        { label: 'select1', value: '1' },
        { label: 'select2', value: '2' },
        { label: 'select3', value: '3' }
      ]}
    />,
    <FilterItemTextInput
      foldMode="vertical"
      label="备注"
      labelWidth={80}
      value={filterParams.value3}
      placeholder="请输入备注"
      onChange={val => filtersChange({ value3: val })}
    />,
    <FilterItemTextInput
      foldMode="vertical"
      label="审核人"
      labelWidth={80}
      value={filterParams.value4}
      placeholder="请输入名字"
      onChange={val => filtersChange({ value4: val })}
    />,

    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />,
    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />,
    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />,
    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />,
    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />,
    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />,
    <FilterItemCheckbox
      foldMode="vertical"
      checked={filterParams.value5}
      label="复选框筛选"
      onChange={val => filtersChange({ value5: val })}
    />
  ]

  const rightJsx = (
    <>
      <FilterItemCheckbox
        style={ml12}
        checked={filterParams.value1}
        label="显示现金类科目"
        onChange={val => dispatch(getTableData({ value1: val }))}
      />
      <FilterRefresh
        style={ml12}
        onClick={() => {
          dispatch(getTableData())
        }}
      />
    </>
  )

  return (
    <div className={classnames('app-page1-filter-container', styles.filter)}>
      <FoldVertical
        className="page1-filter-container"
        hasFilter={hasFilter}
        rightJsx={rightJsx}
        filterItem={filterItem}
        onSearch={() => dispatch(getTableData({ page: 1 }))}
        onReset={handleReset}
      >
        <div className="page1-filter-container-select">
          <DatePicker.RangePicker
            allowClear={false}
            value={[dayjs(filterParams.dateFrom), dayjs(filterParams.dateTo)]}
            onChange={val => {
              dispatch(
                getTableData({
                  fromPeriod: dayjs(val[0]).format('YYYY-MM-DD').toString(),
                  toPeriod: dayjs(val[1]).format('YYYY-MM-DD').toString()
                })
              )
            }}
          />
        </div>
      </FoldVertical>
      <div className={classnames('app-page1-filter-container-btns', styles.btns)}>
        <Space>
          <Button type="primary">新增</Button>
          <Button>批量审核</Button>
        </Space>
      </div>
    </div>
  )
}

export default FilterCom
