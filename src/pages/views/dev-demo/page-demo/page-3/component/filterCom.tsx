import React, { FC, useEffect, useState } from 'react'
import { DatePicker, Button, Select, Space } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import FilterFold from '@/components/filter-fold/index'
import { FilterItemCheckbox, FilterItemSelect, FilterItemTextInput } from '@/components/filter-item-components'
import { defaultFilterParams, getTableData, setFilterParams } from '../store'
import { PAGE_NAME } from '../const'
import FilterRefresh from '@/components/filter-refresh'
import styles from '../index.module.less'
import classnames from 'classnames'
import { isEqualObject } from '@/utils/util'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

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
    setHasFilter(!isEqualObject(defaultFilterParams, liveCurFilter, ['page', 'pageSize', 'dateFrom', 'dateTo', 'type', 'value1']))
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
      style={filterItemStyle}
      label="现金流量项"
      value={filterParams.value2}
      onChange={val => filtersChange({ value2: val })}
      options={[
        { label: 'select1', value: '1' },
        { label: 'select2', value: '2' },
        { label: 'select3', value: '3' }
      ]}
    />,
    <FilterItemTextInput
      style={filterItemStyle}
      label="备注"
      value={filterParams.value3}
      placeholder="请输入备注"
      onChange={val => filtersChange({ value3: val })}
    />,
    <FilterItemTextInput
      style={filterItemStyle}
      label="审核人"
      value={filterParams.value4}
      placeholder="请输入名字"
      onChange={val => filtersChange({ value4: val })}
    />,
    <FilterItemSelect
      style={filterItemStyle}
      label="现金流量项2"
      value={filterParams.value2}
      onChange={val => filtersChange({ value2: val })}
      options={[
        { label: 'select1', value: '1' },
        { label: 'select2', value: '2' },
        { label: 'select3', value: '3' }
      ]}
    />,
    <FilterItemTextInput
      style={filterItemStyle}
      label="备注2"
      value={filterParams.value3}
      placeholder="请输入备注"
      onChange={val => filtersChange({ value3: val })}
    />,
    <FilterItemTextInput
      style={filterItemStyle}
      label="审核人2"
      value={filterParams.value4}
      placeholder="请输入名字"
      onChange={val => filtersChange({ value4: val })}
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
      <FilterFold
        className="page1-filter-container"
        hasFilter={hasFilter}
        rightJsx={rightJsx}
        filterItem={filterItem}
        onSearch={() => dispatch(getTableData({ page: 1 }))}
        onReset={handleReset}
      >
        <div className="page1-filter-container-select">
          <Select
            className="page1-filter-container-select_select"
            dropdownStyle={{ width: 'auto' }}
            value={filterParams.type}
            onSelect={val => dispatch(getTableData({ type: val }))}
          >
            <Option value="1">制单日期</Option>
            <Option value="2">发票日期</Option>
          </Select>
          <div className="page1-filter-container-select_line" />
          <RangePicker
            allowClear={false}
            value={[dayjs(filterParams.dateFrom), dayjs(filterParams.dateTo)]}
            onChange={val => {
              dispatch(
                getTableData({
                  dateFrom: dayjs(val[0]).format('YYYY-MM-DD').toString(),
                  dateTo: dayjs(val[1]).format('YYYY-MM-DD').toString()
                })
              )
            }}
          />
        </div>
      </FilterFold>
      <div className={classnames('app-page1-filter-container-btns', styles.btns)}>
        <Space>
          <Button type="primary">新增</Button>
          <Button>批量审核</Button>
          <Button>导出</Button>
        </Space>
      </div>
    </div>
  )
}

export default FilterCom
