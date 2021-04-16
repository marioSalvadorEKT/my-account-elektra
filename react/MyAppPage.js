import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
// Your component pages
import MyOrdersElektra from './pages/MyOrdersElektra'
import ViewOrder from './pages/ViewOrder'
import SelectItemsToCancel from './pages/SelectItemsToCancel'
import CancelOrders from './pages/CancelOrders'
import AccountRoute from './components/AccountRoute'
import AccountProvider from './actions/account';


const store = configureStore()

const MyAppPage = () => (
  <Provider store={store}>
    <Fragment>
      <Route exact path="/pedidos" component={MyOrdersElektra} allowSAC />
      <Route exact path="/pedidos/:orderId" component={ViewOrder} allowSAC />
      <Route exact path="/pedidos/seleccionar-articulos/:orderId" component={SelectItemsToCancel} allowSAC/>
      <AccountProvider>
        <AccountRoute exact path="/pedidos/seleccionar-articulos/:orderId/cancelar-mi-pedido" component={CancelOrders} allowSAC/>
      </AccountProvider>
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
