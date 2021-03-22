import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../../components/commons/Spinner'
import Orders from '../../components/Orders'
import Error from '../../components/commons/Error'
import scrollKeeper from '../../utils/scrollKeeper'
import Loader from '../../components/commons/Loader'
import React, { useEffect, useState } from 'react'
import Empty from '../../components/Orders/EmptyState'
import Greeting from '../../components/commons/Greeting'
import { fetchOrders } from '../../actions/order-actions'
import OrdersList from '../../components/Order/OrdersList'
import { ContentWrapper } from 'vtex.my-account-commons'
import styles from './index.css'


const headerConfig = () => {
  return {
    titleId: 'myOrders.title',
    namespace: 'vtex-account__orders-list',
  }
}

const MyOrdersElektra = (props) => {

  const { allowSAC, userOrders, isLoading, ordersError, fetchOrders } = props
  const emptyOrders = userOrders && !userOrders.length

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

  console.log(props)

  const handleCustomerImpersonation = () => {
    fetchOrders()
  }


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
