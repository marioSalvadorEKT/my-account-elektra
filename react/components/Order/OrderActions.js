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
          
      </div>
    )
  }
}

OrderActions.propTypes = {
  order: PropTypes.object.isRequired,
  allowSAC: PropTypes.bool,
}

export default OrderActions
