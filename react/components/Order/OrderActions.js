import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'vtex.my-account-commons/Router'

import { OrderUtils } from '../../utils'
import OrderAction from './OrderAction'

class OrderActions extends Component {
  handleOrderAgainClick = () => {
    const {
      order: { orderGroup },
    } = this.props
    const { protocol, hostname } = window.location
    return window.open(
      `${protocol}//${hostname}/checkout/orderform/createBy/${orderGroup}`,
      '_self'
    )
  }

  render() {
    const { order, allowSAC } = this.props
    const {
      orderId,
      allowEdition,
      allowCancellation,
      paymentData: { transactions },
    } = order

    const showEditOrderButton = allowSAC && allowEdition
    const showCancelOrderButton = allowCancellation
    const bankInvoiceUrl = OrderUtils.getBankInvoiceUrl(transactions)

    const showPrintBankInvoiceButton = allowCancellation && bankInvoiceUrl
    return (
      <div className="cf fr db w-100 w-30-ns pt0-xl pt5">
        {showPrintBankInvoiceButton && (
          <OrderAction
            classID="myo-invoice-btn"
            labelID="order.printBankInvoice"
            route={bankInvoiceUrl}
          >
            <g>
              <rect width="2" height="16" />{' '}
              <rect x="14" width="2" height="16" />{' '}
              <rect data-color="color-2" x="3" width="2" height="16" />{' '}
              <rect data-color="color-2" x="11" width="2" height="16" />{' '}
              <polygon points="10,16 6,16 6,0 10,0 10,0" />
            </g>
          </OrderAction>
        )}
        {!showPrintBankInvoiceButton && (
          <OrderAction
            classID="myo-reorder-btn"
            labelID="order.orderAgain"
            onClick={this.handleOrderAgainClick}
          >
            <g>
              <circle cx="3.5" cy="12.5" r="2.5" />
              <path d="M8,1C6.127,1,4.35,1.758,3.052,3.052L0.9,0.9L0.2,7.3l6.4-0.7L4.465,4.465C5.393,3.542,6.662,3,8,3 c2.757,0,5,2.243,5,5s-2.243,5-5,5v2c3.859,0,7-3.14,7-7S11.859,1,8,1z" />
            </g>
          </OrderAction>
        )}
        {showEditOrderButton && (
          <OrderAction
            classID="myo-edit-btn"
            labelID="order.changeOrder"
            route={`/orders/${orderId}/edit`}
            isInternalRoute
          >
            <g>
              <rect y="14" width="16" height="2" />{' '}
              <path d="M11.7,3.3c0.4-0.4,0.4-1,0-1.4l-1.6-1.6c-0.4-0.4-1-0.4-1.4,0L0,9v3h3L11.7,3.3z" />
            </g>
          </OrderAction>
        )}
        {showCancelOrderButton && (
          <OrderAction
            classID="myo-cancel-btn"
            labelID="order.cancelOrder"
            warning="true"
            route={`/orders/${orderId}/cancel`}
            isInternalRoute
          >
            <path d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M11.5,10.1l-1.4,1.4L8,9.4l-2.1,2.1l-1.4-1.4L6.6,8 L4.5,5.9l1.4-1.4L8,6.6l2.1-2.1l1.4,1.4L9.4,8L11.5,10.1z" />
          </OrderAction>
        )}
        <Link
          to={`/orders/${orderId}`}
          className="myo-details-btn db tc pv3 ph5 br2 w-100 f6 fw4 link bg-action-secondary c-on-action-secondary hover-action-secondary mt5"
        >
          <span className="db pv2">
            <FormattedMessage id="order.goToOrderDetails" />
          </span>
        </Link>
      </div>
    )
  }
}

OrderActions.propTypes = {
  order: PropTypes.object.isRequired,
  allowSAC: PropTypes.bool,
}

export default OrderActions
