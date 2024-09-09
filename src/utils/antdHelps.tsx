import { DownOutlined, RightOutlined } from '@ant-design/icons'
import React, { FC, useEffect, useState } from 'react'

export const getPopupContainer = () => {
  return document.getElementById('pageContainerWrapper')
}

export const tableExpandIcon = ({ expanded, onExpand, record }) => {
  if (!(record.children?.length > 0)) {
    return <span className="tableExpandIconEmpty"></span>
  }
  return expanded ? (
    <span className="tableExpandIcon">
      <DownOutlined onClick={e => onExpand(record, e)} />
    </span>
  ) : (
    <span className="tableExpandIcon">
      <RightOutlined onClick={e => onExpand(record, e)} />
    </span>
  )
}
