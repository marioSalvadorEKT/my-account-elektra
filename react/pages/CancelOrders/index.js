import React, { useState } from 'react';
import queryString from 'query-string';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import CancelationOffline from '../../components/CancelationOffline';
import CancellationAlertStatus from '../../components/CancellationAletStatus';
import Spinner from '../../components/commons/Spinner';
import getStatus from '../../utils/getStatus';
import PropTypes from 'prop-types'

import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { ContentWrapper } from 'vtex.my-account-commons'
import {
  fetchOrderAndReasons,
  getCancellationReasons
} from '../../actions/order-actions'
import { Link } from 'vtex.my-account-commons/Router'


const ShippingIcon = 
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <title>my-shippings</title>
      <path d="M16 5c0.038-0.005 0.081-0.008 0.125-0.008s0.087 0.003 0.13 0.009l-0.005-0.001 9.56 3.83c0.266 0.11 0.45 0.367 0.45 0.667 0 0.001 0 0.002 0 0.003v-0 12.96c-0.003 0.297-0.186 0.551-0.445 0.658l-0.005 0.002-9.54 3.88c-0.080 0.033-0.173 0.053-0.27 0.053s-0.19-0.019-0.275-0.054l0.005 0.002-9.56-3.88c-0.264-0.109-0.447-0.363-0.45-0.66v-12.92c0-0.001 0-0.002 0-0.003 0-0.3 0.184-0.558 0.445-0.666l0.005-0.002 9.56-3.87c0.041-0.006 0.087-0.009 0.135-0.009s0.094 0.003 0.14 0.010l-0.005-0.001zM16 6.49l-7.62 3 2.69 1.080 7.2-3.22zM20.38 8.24l-7.38 3.13 3 1.22 7.62-3.050zM24.85 10.6l-8.13 3.26v11.36l8.13-3.22zM7.15 10.6v11.4l8.13 3.26v-11.4l-3.11-1.25v3.39l-1.91-0.72v-3.43z"></path>
    </svg>

const ArrowLeftIcon = 
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <title>arrow-left-slim</title>
    <path d="M18.94 24c-0 0-0.001 0-0.001 0-0.354 0-0.67-0.163-0.877-0.418l-0.002-0.002-6-7.34c-0.082-0.098-0.132-0.226-0.132-0.365s0.050-0.267 0.133-0.366l-0.001 0.001 6-7.11c0.211-0.247 0.522-0.402 0.87-0.402 0.631 0 1.142 0.511 1.142 1.142 0 0.283-0.103 0.542-0.273 0.742l0.001-0.002-4.8 5.65c-0.085 0.099-0.136 0.228-0.136 0.37s0.052 0.271 0.137 0.371l-0.001-0.001 4.81 5.86c0.162 0.195 0.261 0.449 0.261 0.726 0 0.356-0.163 0.674-0.419 0.883l-0.002 0.002c-0.192 0.162-0.441 0.26-0.714 0.26-0.006 0-0.011-0-0.017-0h0.001z"></path>
  </svg>



export const headerConfig = ({ order, intl }) => {
  const backButton = {
    title: "Mis pedidos",
    path: order && order.orderId ? `/pedidos/${order.orderId}` : '/pedidos',
  }

  const customButton = (
    <div>
      <Link to={'/pedidos'}>
        {ArrowLeftIcon}
        {ShippingIcon}
        <span>Regresar a mis pedidos</span>
      </Link>
      <Link to={order && order.orderId ? `/pedidos/${order.orderId}` : '/pedidos'}>
        {ArrowLeftIcon}
        {ShippingIcon}
        <span>Cancelación</span>
      </Link>
    </div>
  )

  return {
    headerContent: customButton,
    titleId: `orders.titleNull`,
    backButton,
    namespace: 'vtex-account__edit-order-id',
  }
}

const CancelOrders = (propsData) => {

  
  const {
    intl,
    order,
    match,
    isLoading,
    orderError,
    location,
    props,
    state,
    actions,
    isSubmitting,
    cancellationOptions,
    cancellationReasonsError,
    hasFetchedCancellationOptions,
  } = propsData


  const {items, orderId} = queryString.parse(props.location.search);

  const status = getStatus(orderId) || null;
  const valueStatus = status.index;
  const [showNoCancel, setNoCancel] = useState(true);


  const renderWrapper = children => {
    return (
      <ContentWrapper {...headerConfig({ order, intl })}>
        {() => children}
      </ContentWrapper>
    )
  }

  if (orderError) return renderWrapper(<Error error={orderError} />)

/*   if ( isLoading ) {
    return (
      <div className="w-100 pt6 tc">
        <Spinner/>
      </div>
    )
  } */

  return  renderWrapper(
    <div>
      <section>
        <div className="titleSelectItems">
          Solicitud de Cancelación
        </div>
        <CancelationOffline {...{ state, actions, props }} />
      </section>
      {valueStatus >= 2 && showNoCancel && (
        <CancellationAlertStatus onClose={() => setNoCancel(false)} />
      )}
    </div>
  );
};


CancelOrders.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  isLoading: PropTypes.bool,
  orderError: PropTypes.object,
  fetchOrderAndReasons: PropTypes.func.isRequired,
  getCancellationReasons: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  cancellationOptions: PropTypes.object,
  hasFetchedCancellationOptions: PropTypes.bool,
  cancellationReasonsError: PropTypes.object,
  isSubmitting: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.myOrders.isLoading,
  orderError: state.myOrders.orderError,
  cancellationOptions: state.myOrders.options,
  hasFetchedCancellationOptions: state.myOrders.hasFetchedCancellationOptions,
  cancellationReasonsError: state.myOrders.cancellationReasonsError,
  isSubmitting: state.myOrders.isSubmittingOrderCancellation,
})


export default connect(mapStateToProps,{
  fetchOrderAndReasons,
  getCancellationReasons
})(CancelOrders)