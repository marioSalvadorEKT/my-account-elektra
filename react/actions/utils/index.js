import Cookies from 'js-cookie'
import axiosRetry from '@vtex/axios-concurrent-retry'

import axios from '../../utils/customAxios'

let session

function getSession() {
  axiosRetry(axios, {
    retries: 3,
    retryTimeout: 1,
    retryDelay: axiosRetry.exponentialDelay,
  })
  return axios.get('/api/sessions/?items=*').then(({ data }) => data)
}

function getImpersonatedCustomerEmail() {
  return Cookies.get('vtex-impersonated-customer-email')
}

async function getImpersonatedCustomerFromSessionOrCookie() {
  // eslint-disable-next-line require-atomic-updates
  session = session || (await getSession())
  if (session && session.active) {
    return (
      (session.namespaces &&
        session.namespaces.impersonate &&
        session.namespaces.impersonate.storeUserEmail &&
        session.namespaces.impersonate.storeUserEmail.value) ||
      null
    )
  }
  return getImpersonatedCustomerEmail()
}

export async function getOrdersURL(baseUrl, page = '1') {
  session = null
  const customerEmail = await getImpersonatedCustomerFromSessionOrCookie()
  return customerEmail
    ? `${baseUrl}?clientEmail=${customerEmail}&page=${page}`
    : `${baseUrl}?page=${page}`
}

export async function getOrderDetailURL(baseUrl) {
  const customerEmail = await getImpersonatedCustomerFromSessionOrCookie()

  return customerEmail ? `${baseUrl}?clientEmail=${customerEmail}` : baseUrl
}

export const parseJSON = response => {
  return response.json()
}

export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  throw response
}
