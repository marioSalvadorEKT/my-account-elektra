import React from 'react'
import PropTypes from 'prop-types'

import { OrderUtils } from '../../utils'
import ViewAllOrderProductsButton from '../commons/ViewAllOrderProductsButton'
import OrderProduct from './OrderProduct'
import OrderActions from './OrderActions'
import FormattedDate from '../commons/FormattedDate'
import FinalPrice from '../commons/FinalPrice'
import { FormattedMessage } from 'react-intl'

import Tag from '../../images/icons/tag.svg';
import Calendar from '../../images/icons/calendar.svg';
import Cash from '../../images/icons/cash.svg';
import  currency from '../../utils/currency';
import  amount from '../../utils/amount';
import getIcon from './TrackingSteaper/icons/OrderIcons'


const Order = ({ order, alwaysActive, allowSAC }) => {
  const {
    orderId,
    status,
    items = [],
    marketplaceItems = [],
    childOrders,
    storePreferencesData: { currencyCode },
    sellers,
    creationDate,
    totals,
    paymentData
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

  const shipping = totals.find(({id})=> id === "Shipping")

  return (
    <div className="cf w-100 pa5 ph7-ns bb b--muted-5 bg-base lh-copy flex items-center">
      <div className="w-20">
          <div className="mv3">
            <div className="f7 c-muted-2 flex items-center">
              {getIcon("tag")}
              <FormattedMessage id="order.sellingBy" />
            </div>
            <div className="f6 c-muted-3 fw6">{sellers[0].name}</div>
          </div>
          <div className="mv3">
            <div className="f7 c-muted-2 flex items-center">
              {getIcon("calendar")}
              <div>
                <FormattedMessage id="order.dateIs" />
              </div>
            </div>
            <div className="f6 c-muted-3 fw6">
              <FormattedDate date={creationDate} />
            </div>
          </div>
          <div className="mv3 f7 c-muted-2  items-center">
            {
              shipping && shipping.value !== 0 && (
                <>
                  <div>Costo de envío</div>
                  <span>{`$ ${currency(amount(shipping.value))}`}</span>
                </>
              )
            }
          </div>
          <div className="mv3">
            <div className="f7 c-muted-2 flex items-center">
              {getIcon("cash")}
              <FormattedMessage id="order.total" />
            </div>
            <div className="f6 c-muted-3 fw6">
              {/* <FinalPrice
                totals={totals}
                currencyCode={currencyCode}
                transactions={paymentData.transactions}
              /> */}
              <span>{`$ ${currency(amount(totals.reduce((price, total) => price + total.value, 0)))}`}</span>
            </div>
            
          </div>
      </div>
      <div className="w-80">
        {products.map((item, index) => (
          <OrderProduct product={item} currency={currencyCode} key={index} />
        ))}
        {items && items.length > 5 && (
          <ViewAllOrderProductsButton orderId={orderId} />
        )}
      </div>
    </div>
  )
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
  alwaysActive: PropTypes.bool,
  allowSAC: PropTypes.bool,
}

export default Order
