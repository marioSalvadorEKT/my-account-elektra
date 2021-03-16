import React from 'react'
import { FormattedMessage } from 'react-intl'

import { OrderUtils } from '../../utils'
import { OrderShape } from '../../types'

const StatusBadge = ({ order }) => {
  let orderState = 'unknown'
  const isPickup = OrderUtils.isOrderPickUp(order)
  const wasDelivered = OrderUtils.isOrderDelivered(order)
  const isReadyToPickup =
    OrderUtils.isOrderPickUp(order) && OrderUtils.isOrderReadyToPickUp(order)

  const { status: normalizedStatus } = OrderUtils.getFullState(order.status)

  if (order.status) {
    orderState = order.status
    if (
      isPickup &&
      [
        'window-to-cancel',
        'approve-payment',
        'ready-for-handling',
        'handling',
        'release-to-fulfillment',
      ].includes(order.status)
    ) {
      orderState = 'handlingPickup'
    } else if (normalizedStatus === 'success') {
      if (isPickup) {
        if (wasDelivered) {
          orderState = 'pickedUp'
        } else if (isReadyToPickup) {
          orderState = 'ready-for-pickup'
        } else {
          orderState = 'handlingPickup'
        }
      } else if (wasDelivered) {
        orderState = 'delivered'
      }
    }
  }

  let styles
  let textStyle

  switch (normalizedStatus) {
    case 'normal':
      styles = 'bg-muted-1'
      textStyle = 'c-on-muted-1'
      break

    case 'cancelled':
      styles = 'bg-danger'
      textStyle = 'c-on-danger'
      break

    case 'pending':
      styles = 'bg-warning'
      break

    case 'disabled':
      styles = 'bg-muted-2'
      textStyle = 'c-on-muted-2'
      break

    case 'success':
      styles = 'bg-success'
      textStyle = 'c-on-success'
      break

    default:
      styles = 'bg-muted-2'
      textStyle = 'c-on-muted-2'
  }

  return (
    <div className={`dib br2 pv2 ph3 f7 fw5 tc ${styles}`}>
      <span className={textStyle || 'c-on-base'}>
        <FormattedMessage id={`order.state.${orderState}`} />
      </span>
    </div>
  )
}

StatusBadge.propTypes = {
  order: OrderShape,
}

export default StatusBadge
