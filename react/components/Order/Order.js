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

  return (
    <div className="cf w-100 pa5 ph7-ns bb b--muted-5 bg-base lh-copy flex items-start ">
      <div className="w-20">
          <div className="mv3">
            <div className="f7 c-muted-2 flex items-center">
              <img src={Tag} height={23} width={23} alt="Tag" className="mr2"/>
              <FormattedMessage id="order.sellingBy" />
            </div>
            <div className="f6 c-muted-3 fw6">{sellers[0].name}</div>
          </div>
          <div className="mv3">
            <div className="f7 c-muted-2 flex items-center">
              <img src={Calendar} height={15} width={15} alt="Calendar" className="mr2"/>
              <div>
                <FormattedMessage id="order.dateIs" />
              </div>
            </div>
            <div className="f6 c-muted-3 fw6">
              <FormattedDate date={creationDate} />
            </div>
          </div>
          <div className="mv3">
            <div className="f7 c-muted-2 flex items-center">
              <img src={Cash} height={22} width={22} alt="Cash" className="mr2"/>
              <FormattedMessage id="order.total" />
            </div>
            <div className="f6 c-muted-3 fw6">
              <FinalPrice
                totals={totals}
                currencyCode={currencyCode}
                transactions={paymentData.transactions}
              />
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
