import keyBy from 'lodash/keyBy'
import Promise from 'bluebird'

import { skuReplacementEnabled } from '../utils/replacementUtils'
import { getReasons } from '../services/MasterData'
import {
  RECEIVE_ORDERS,
  RECEIVE_ORDERS_ERROR,
  REQUEST_ORDERS,
  RECEIVE_ORDER,
  REQUEST_REPLACEMENT_OPTIONS,
  REQUEST_CANCELLATION_OPTIONS,
  RECEIVE_ORDER_ERROR,
  RECEIVE_PARENT_ORDERS,
  RECEIVE_REPLACEMENT_OPTIONS,
  RECEIVE_CANCELLATION_OPTIONS,
  REDIRECT_PAGE,
  RECEIVE_MORE_ORDERS,
  RECEIVE_CANCELLATION_REASONS_ERROR,
  RECEIVE_REPLACEMENT_REASONS_ERROR,
  REQUEST_ORDER_CANCELLATION,
  RECEIVE_ORDER_CANCELLATION_ERROR,
} from './types'
import {
  parseJSON,
  checkStatus,
  getOrdersURL,
  getOrderDetailURL,
} from './utils/index'

const BASE_URL = '/api/oms/user/orders/'
const ORDERS_DETAILED_LOADED_LIMIT = 3

async function loadOrders(page = '1') {
  return fetch(await getOrdersURL(BASE_URL, page), {
    credentials: 'same-origin',
  })
    .then(checkStatus)
    .then(parseJSON)
}

async function loadOrder(orderId) {
  return fetch(await getOrderDetailURL(BASE_URL + orderId), {
    credentials: 'same-origin',
  })
    .then(checkStatus)
    .then(parseJSON)
}

export function goToHomePageAndReload(orderId) {
  window.location.href = `${window.location.pathname}?canceledOrder=${orderId}`
}

export const requestOrders = () => ({
  type: REQUEST_ORDERS,
})

export const requestReplacementOptions = () => ({
  type: REQUEST_REPLACEMENT_OPTIONS,
})

export const requestCancellationOptions = () => ({
  type: REQUEST_CANCELLATION_OPTIONS,
})

export const redirectPage = () => ({
  type: REDIRECT_PAGE,
})

export const receiveOrders = (
  basicOrders,
  userOrders,
  detailedOrders,
  currentPage,
  pages
) => ({
  type: RECEIVE_ORDERS,
  basicOrders,
  userOrders,
  detailedOrders,
  currentPage,
  pages,
})

export const receiveMoreOrders = (
  basicOrders,
  userOrders,
  currentPage,
  pages
) => ({
  type: RECEIVE_MORE_ORDERS,
  basicOrders,
  userOrders,
  currentPage,
  pages,
})

export const receiveOrder = order => ({
  type: RECEIVE_ORDER,
  order,
})

export const receiveReplacementOptions = availableOptions => ({
  type: RECEIVE_REPLACEMENT_OPTIONS,
  availableOptions,
})

export const receiveCancellationOptions = availableOptions => ({
  type: RECEIVE_CANCELLATION_OPTIONS,
  availableOptions,
})

export const receiveParentOrders = parentOrders => ({
  type: RECEIVE_PARENT_ORDERS,
  parentOrders,
})

export const receiveOrdersError = error => ({
  type: RECEIVE_ORDERS_ERROR,
  error,
})

export const receiveCancellationReasonsError = error => ({
  type: RECEIVE_CANCELLATION_REASONS_ERROR,
  error,
})

export const requestOrderCancellation = () => ({
  type: REQUEST_ORDER_CANCELLATION,
})

export const receiveOrderCancellationError = error => ({
  type: RECEIVE_ORDER_CANCELLATION_ERROR,
  error,
})

export const receiveReplacementReasonsError = error => ({
  type: RECEIVE_REPLACEMENT_REASONS_ERROR,
  error,
})

export const receiveOrderError = error => ({
  type: RECEIVE_ORDER_ERROR,
  error,
})

export const fetchMoreOrders = page => dispatch => {
  return loadOrders(page)
    .then(response => {
      const orders = response.list
      const { userOrders } = orders.reduce(
        (totalOrders, order) => {
          totalOrders.userOrders = [...totalOrders.userOrders, order.orderId]
          return totalOrders
        },
        { userOrders: [] }
      )
      dispatch(
        receiveMoreOrders(
          keyBy(orders, 'orderId'),
          userOrders,
          response.paging.currentPage,
          response.paging.pages
        )
      )
    })
    .catch(error => dispatch(receiveOrdersError(error)))
}

export const fetchOrders = () => dispatch => {
  dispatch(requestOrders())
  return loadOrders()
    .then(response => {
      const orders = response.list
      const { userOrders, ordersToBeLoaded } = orders.reduce(
        (totalOrders, order) => {
          if (
            !order.status ||
            totalOrders.ordersToBeLoaded.length < ORDERS_DETAILED_LOADED_LIMIT
          ) {
            totalOrders.ordersToBeLoaded = [
              ...totalOrders.ordersToBeLoaded,
              order.orderId,
            ]
          }
          totalOrders.userOrders = [...totalOrders.userOrders, order.orderId]
          return totalOrders
        },
        { ordersToBeLoaded: [], userOrders: [] }
      )
      return Promise.map(ordersToBeLoaded, loadOrder).then(
        ordersDetailedList => {
          dispatch(
            receiveOrders(
              keyBy(orders, 'orderId'),
              userOrders,
              keyBy(ordersDetailedList, 'orderId'),
              response.paging.currentPage,
              response.paging.pages
            )
          )
        }
      )
    })
    .catch(error => dispatch(receiveOrdersError(error)))
}

export const fetchParentOrders = (order, orders) => dispatch => {
  if (
    order.commercialConditionData &&
    order.commercialConditionData.parentOrderId
  ) {
    return loadOrder(order.commercialConditionData.parentOrderId)
      .then(orderFetched => {
        return dispatch(
          fetchParentOrders(orderFetched, [...orders, orderFetched])
        )
      })
      .catch(error => dispatch(receiveOrderError(error)))
  }
  dispatch(receiveParentOrders(orders))
  return Promise.resolve()
}

export const fetchOrder = (orderId, fetchParents = false) => dispatch => {
  return loadOrder(orderId)
    .then(order => {
      dispatch(receiveOrder(order))
      if (!fetchParents) return
      dispatch(fetchParentOrders(order, []))
      return null
    })
    .catch(error => dispatch(receiveOrderError(error)))
}

export const getReplacementReasons = (locale, order) => dispatch => {
  dispatch(requestReplacementOptions())
  return getReasons('replacement', locale)
    .then(options => {
      if (!options || !options.groups || !options.groups.length) {
        dispatch(receiveReplacementOptions([]))
      }
      return skuReplacementEnabled(order).then(isSkuReplaceable => {
        const groups = options.groups.map(group => {
          if (!isSkuReplaceable && group.id === 'sku') {
            return { ...group, enabled: false }
          }
          return { ...group, enabled: true }
        })
        const availableOptions = {
          ...options,
          groups,
        }
        dispatch(receiveReplacementOptions(availableOptions))
      })
    })
    .catch(error => dispatch(receiveReplacementReasonsError(error)))
}

export const getCancellationReasons = locale => dispatch => {
  dispatch(requestCancellationOptions())
  return getReasons('cancellation', locale)
    .then(options => {
      if (!options || !options.groups || !options.groups.length) {
        return this.goToHomePage()
      }

      options.groups.forEach(group => {
        const hasOther = group.options.some(option => option.value === 'other')
        if (!hasOther) {
          options.groups[0].options = [
            ...options.groups[0].options,
            {
              label: { i18n: 'commons.other' },
              value: 'other',
            },
          ]
        }
      })
      dispatch(receiveCancellationOptions(options))
      return null
    })
    .catch(error => dispatch(receiveCancellationReasonsError(error)))
}

export const fetchOrderAndReasons = (orderId, locale, type) => dispatch => {
  return loadOrder(orderId)
    .then(order => {
      dispatch(receiveOrder(order))
      if (type === 'replacement') {
        dispatch(getReplacementReasons(locale, order))
      } else {
        dispatch(getCancellationReasons(locale, order))
      }
      return null
    })
    .catch(error => dispatch(receiveOrderError(error)))
}

export const redirect = (protocol, hostname, orderId, reasonId) => dispatch => {
  dispatch(redirectPage())
  return window.open(
    `${protocol}//${hostname}/checkout/orderform/createFromCommercialConditions/${orderId}?reason=${reasonId}`,
    '_self'
  )
}

export const cancelOrder = (orderId, reason = '') => dispatch => {
  dispatch(requestOrderCancellation())
  const data = { reason }
  return fetch(`/api/checkout/pub/orders/${orderId}/user-cancel-request`, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(() => {
      goToHomePageAndReload(orderId)
    })
    .catch(error => dispatch(receiveOrderCancellationError(error)))
}
