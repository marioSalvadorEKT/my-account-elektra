import React from 'react'
import PropTypes from 'prop-types'

import { OrderUtils } from '../../utils'
import ViewAllOrderProductsButton from '../commons/ViewAllOrderProductsButton'
import OrderProduct from './OrderProduct'
import OrderActions from './OrderActions'

const Order = ({ order, alwaysActive, allowSAC }) => {
  const {
    orderId,
    status,
    items = [],
    marketplaceItems = [],
    childOrders,
    storePreferencesData: { currencyCode },
  } = order

  if (
    !alwaysActive &&
    (!OrderUtils.isOrderActive(status) ||
      (childOrders && childOrders.length > 0))
  ) {
    return null
  }

  const MAX_PRODUCTS_SHOWN = 5

  const products =
    marketplaceItems.length === 0
      ? items.slice(0, MAX_PRODUCTS_SHOWN)
      : marketplaceItems.slice(0, MAX_PRODUCTS_SHOWN)

  return (
    <div className="cf pa5 pa6-l bg-base bt-0">
      <div className="fl w-100 w-70-ns">
        {products.map((item, index) => (
          <OrderProduct product={item} currency={currencyCode} key={index} />
        ))}
        {items && items.length > 5 && (
          <ViewAllOrderProductsButton orderId={orderId} />
        )}
      </div>
      <OrderActions order={order} allowSAC={allowSAC} />
    </div>
  )
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
  alwaysActive: PropTypes.bool,
  allowSAC: PropTypes.bool,
}

export default Order
