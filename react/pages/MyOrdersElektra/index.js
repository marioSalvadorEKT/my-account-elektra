import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../../components/commons/Spinner'
import Orders from '../../components/Orders'
import Error from '../../components/commons/Error'
import scrollKeeper from '../../utils/scrollKeeper'
import React, { useEffect, useState } from 'react'
import Empty from '../../components/Orders/EmptyState'
import Greeting from '../../components/commons/Greeting'
import { fetchOrders } from '../../actions/order-actions'
import OrdersList from '../../components/Order/OrdersList'
import { ContentWrapper } from 'vtex.my-account-commons'
import styles from './index.css'

  const ShippingIcon = 
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <title>my-shippings</title>
      <path d="M16 5c0.038-0.005 0.081-0.008 0.125-0.008s0.087 0.003 0.13 0.009l-0.005-0.001 9.56 3.83c0.266 0.11 0.45 0.367 0.45 0.667 0 0.001 0 0.002 0 0.003v-0 12.96c-0.003 0.297-0.186 0.551-0.445 0.658l-0.005 0.002-9.54 3.88c-0.080 0.033-0.173 0.053-0.27 0.053s-0.19-0.019-0.275-0.054l0.005 0.002-9.56-3.88c-0.264-0.109-0.447-0.363-0.45-0.66v-12.92c0-0.001 0-0.002 0-0.003 0-0.3 0.184-0.558 0.445-0.666l0.005-0.002 9.56-3.87c0.041-0.006 0.087-0.009 0.135-0.009s0.094 0.003 0.14 0.010l-0.005-0.001zM16 6.49l-7.62 3 2.69 1.080 7.2-3.22zM20.38 8.24l-7.38 3.13 3 1.22 7.62-3.050zM24.85 10.6l-8.13 3.26v11.36l8.13-3.22zM7.15 10.6v11.4l8.13 3.26v-11.4l-3.11-1.25v3.39l-1.91-0.72v-3.43z"></path>
    </svg>


export const headerConfig = () => {
  const backButton = {
    title: "Mis pedidos",
    path:  '/pedidos',
    styles: "color:red;"
  }

  const customButton = (
    <div>
      {ShippingIcon}
      Mis Pedidos
    </div>
  )

  return {
    headerContent: customButton,
    titleId: `orders.titleNull`,
    backButton,
    namespace: 'vtex-account__edit-order-id',
  }
}




const MyOrdersElektra = (props) => {

  const { allowSAC, userOrders, isLoading, ordersError, fetchOrders } = props
  const emptyOrders = userOrders && !userOrders.length

  const handleCustomerImpersonation = () => {
    fetchOrders()
  }

  useEffect(() => {
    if (!userOrders) {
      fetchOrders()
      scrollKeeper.restorePagePositions('orders')
      window.addEventListener(
        'callcenterOperator.setCustomer.vtex',
        handleCustomerImpersonation
      )
    }
    return () => {
      scrollKeeper.savePagePositions('orders')
      window.removeEventListener(
        'callcenterOperator.setCustomer.vtex',
        handleCustomerImpersonation
      )
    }
  }, [userOrders])


  const renderWrapper = children => {
    return (
      <ContentWrapper className={styles.titlePage} {...headerConfig()}>{() => children}</ContentWrapper>
    )
  }

  if (ordersError) return renderWrapper(<Error error={ordersError} />)

  if (isLoading || !userOrders) {
    return renderWrapper(
      <div className="w-100 pt6 tc">
        <Spinner />
      </div>
    )
  }

  return renderWrapper(
    <div className="center w-100 helvetica">
        <Greeting
          param="replacedOrder"
          variation="primary"
          greetingId="greeting.replaced"
        />
        <Greeting
          param="canceledOrder"
          variation="alert"
          greetingId="greeting.cancelled"
        />
        {emptyOrders ? (
          <Empty />
        ) : (
          <Orders>
            <OrdersList orders={userOrders} allowSAC={allowSAC} />
          </Orders>
        )}
      </div>
  )
}

MyOrdersElektra.propTypes = {
  fetchOrders: PropTypes.func.isRequired,
  orders: PropTypes.object,
  userOrders: PropTypes.array,
  detailedOrders: PropTypes.object,
  ordersError: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  allowSAC: PropTypes.bool,
}

const mapStateToProps = state => ({
  orders: state.myOrders.orders,
  userOrders: state.myOrders.userOrders,
  detailedOrders: state.myOrders.detailedOrders,
  ordersError: state.myOrders.ordersError,
  isLoading: state.myOrders.isLoading,
})

export default connect(mapStateToProps, {
  fetchOrders,
})(MyOrdersElektra)
