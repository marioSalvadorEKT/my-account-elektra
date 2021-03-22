import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
// Your component pages
import MyOrdersElektra from './pages/MyOrdersElektra'
import ViewOrder from './pages/ViewOrder'


const store = configureStore()

const MyAppPage = () => (
  <Provider store={store}>
    <Fragment>
      <Route exact path="/pedidos" component={MyOrdersElektra} allowSAC />
      <Route exact path="/pedidos/:orderId" component={ViewOrder} allowSAC />
      {/*<Route
        exact
        path="/pedidos/:orderId/edit"
        component={EditOrder}
        allowSAC
      />
      <Route exact path="/pedidos/:orderId/cancel" component={CancelOrder} /> */}
    </Fragment>
  </Provider>
)

export default MyAppPage
