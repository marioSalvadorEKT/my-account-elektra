import React, { useState } from 'react';
import queryString from 'query-string';
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

const headerConfigCancel = () => {

  const backButton = {
    titleId: 'orders.title',
    path: '/pedidos/seleccionar-articulos',
  }
  return {
    title: `Solicitud de cancelación`,
    backButton,
    namespace: 'vtex-account__cancel-order-reasons',
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
      <ContentWrapper {...headerConfigCancel()}>
        {() => children}
      </ContentWrapper>
    )
  }

  if (orderError) return (<Error error={orderError} />)

/*   if ( isLoading ) {
    return (
      <div className="w-100 pt6 tc">
        <Spinner/>
      </div>
    )
  } */

  return  (
    <div>
      <section>
        <h1>Cancealción</h1>
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