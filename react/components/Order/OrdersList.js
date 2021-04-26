import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Loader from '../commons/Loader'
import Spinner from '../commons/Spinner'
import React from 'react'
import DetailedOrder from './DetailedOrder'
import InfiniteScroll from 'react-infinite-scroller'
import { fetchMoreOrders } from '../../actions/order-actions'



const OrdersList = (props) => {

  const { orders, hasMore, alwaysActive, allowSAC, currentPage } = props

  const loadMore = () => {
    if (hasMore) {
      props.fetchMoreOrders(String(currentPage + 1))
    }
  }

  return (
    <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<Spinner/>}
      >
        {orders.map(orderId => {
          return (
            <DetailedOrder
              key={orderId}
              orderId={orderId}
              alwaysActive={alwaysActive}
              allowSAC={allowSAC}
            />
          )
        })}
      </InfiniteScroll>
  )
}


OrdersList.defaultProps = {
  alwaysActive: true,
}

OrdersList.propTypes = {
  orders: PropTypes.array,
  alwaysActive: PropTypes.bool,
  allowSAC: PropTypes.bool,
  hasMore: PropTypes.bool,
  currentPage: PropTypes.number,
  fetchMoreOrders: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  hasMore: state.myOrders.currentPage < state.myOrders.pages,
  currentPage: state.myOrders.currentPage,
})

export default connect(mapStateToProps, {
  fetchMoreOrders,
})(OrdersList)
