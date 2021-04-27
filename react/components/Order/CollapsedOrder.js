import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'vtex.my-account-commons/Router'

import FormattedDate from '../commons/FormattedDate'
import StatusBadge from '../commons/StatusBadge'
import { OrderUtils } from '../../utils'

class CollapsedOrder extends Component {
  render() {
    const { order, alwaysActive } = this.props

    if (!order || !order.orderId) {
      return (
        <div className="cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5">...</div>
      )
    }

    const { sellerOrderId, orderId, creationDate, status } = order

    const isActive = alwaysActive || OrderUtils.isOrderActive(status)
    const activeClasses = isActive ? 'o-100' : 'o-40'
    const activeType = isActive ? 'f5-l' : 'f6'

    return (
      <Link
        to={`/pedidos/${orderId}`}
        className={`myo-collapsed-order no-underline db cf w-100 pa5 ph7-ns ba b--muted-4 bg-muted-5 mb3 pointer grow ${activeClasses}`}
      >
        <div className="fl-ns w-50-ns">
          {isActive && (
            <div className="w-100 f7 f6-xl fw4 c-muted-1 ttu">
              <FormattedMessage id="order.dateIs" />
            </div>
          )}
          <div className={`db db-xl pv0 f6 fw5 c-on-base ${activeType}`}>
            <FormattedDate date={creationDate} />
          </div>
        </div>

        <div className="fl-ns mt3 mt0-ns w-50-ns">
          <div className="myo-order-id mb3 mb0-xl tl tr-ns f7 f6-xl fw4 c-muted-1">
            # {orderId}
          </div>
          <div className="myo-seller-order-id dn mb3 mb0-xl tl tr-ns f7 f6-xl fw4 c-muted-1">
            # {sellerOrderId}
          </div>
          {isActive && (
            <div className="tr-ns mt2-ns">
              <StatusBadge order={order} />
            </div>
          )}
        </div>
      </Link>
    )
  }
}

CollapsedOrder.propTypes = {
  order: PropTypes.object,
  alwaysActive: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => ({
  order: state.myOrders.orders[ownProps.orderId],
})

export default connect(mapStateToProps)(CollapsedOrder)
