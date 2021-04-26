import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import ReactRouterPropTypes from 'react-router-prop-types'
import packagify from '@vtex/delivery-packages'
import { ContentWrapper } from 'vtex.my-account-commons'

import { OrderUtils } from '../../utils'
import Address from '../../components/commons/Address'
import FormattedDate from '../../components/commons/FormattedDate'
import StatusBadge from '../../components/commons/StatusBadge'
import TrackingDataSpoiler from '../../components/commons/TrackingDataSpoiler'
import {
  fetchOrder,
  fetchParentOrders,
  fetchOrders,
} from '../../actions/order-actions'
import Error from '../../components/commons/Error'
import Spinner from '../../components/commons/Spinner'
import TrackingProgress from '../../components/commons/TrackingProgress'
import InvoiceDataSpoiler from '../../components/commons/InvoiceDataSpoiler'

import uniq from 'lodash/uniq'
import map from 'lodash/map'
import flatten from 'lodash/flatten'

import TrackingSteaper from '../../components/Order/TrackingSteaper'
import ItemDetail from '../../components/ItemDetail'
import { Link } from 'vtex.my-account-commons/Router'
import currency from '../../utils/currency'

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
  const orderTitle = intl.formatMessage({ id: 'orders.title' })
  const orderNumber = order && order.orderId ? `#${order.orderId}` : ''
  const backButton = {
    title: "Mis pedidos",
    path: order && order.orderId ? `/pedidos/${order.orderId}` : '/pedidos',
    styles: "color:red;"
  }

  const customButton = (
    <Link to={'/pedidos'}>
      {ArrowLeftIcon}
      {ShippingIcon}
      <span>Regresar a mis pedidos</span>
    </Link>
  )

  return {
    headerContent: customButton,
    titleId: `orders.titleNull`,
    backButton,
    namespace: 'vtex-account__edit-order-id',
  }
}

const ViewOrder = (props) => {

  const { order, orderError, isLoading, intl } = props
  const [showAdditionalPaymentData, setShowAdditionalPaymentData] = useState(false)

  useEffect(() => {
    
    if (!props.order) {
      props.fetchOrder(props.match.params.orderId, true)
    } else {
      props.fetchParentOrders(props.order, [])
    }
    window.addEventListener(
      'callcenterOperator.setCustomer.vtex',
      handleCustomerImpersonation
    )
    
    return (
      window.removeEventListener(
        'callcenterOperator.setCustomer.vtex',
        handleCustomerImpersonation
      )
    )
  }, [props.match.params.orderId])

  const handleCustomerImpersonation = () => {
    props.fetchOrders()
    goToHomePage()
  }

  const goToHomePage = () => {
    window.browserHistory.push('/pedidos')
  }
  const handleAdditionalPaymentDataClick = () => {
    setShowAdditionalPaymentData(!showAdditionalPaymentData)
  }


  const renderWrapper = children => {
    return (
      <ContentWrapper {...headerConfig({ order, intl })}>
        {() => children}
      </ContentWrapper>
    )
  }

  if (orderError) return renderWrapper(<Error error={orderError} />)

  if (isLoading || !order) {
    return renderWrapper(
      <div className="w-100 pt6 tc">
        <Spinner/>
      </div>
    )
  }

  if (!order || !order.orderId) {
    return null
  }

  const {
    paymentData,
    status,
    creationDate,
    totals,
    shippingData: { address, logisticsInfo: logisticsShipping },
    storePreferencesData: { currencyCode },
    paymentData: { transactions },
    allowCancellation,
    sellers,
    changesAttachment,
    items,
  } = order

  const paymentMethods = uniq(
    flatten(
      map(paymentData.transactions, transaction =>
        map(transaction.payments, payment => payment)
      )
    ),
    'paymentSystem'
  )

  const bankInvoiceUrl = OrderUtils.getBankInvoiceUrl(transactions)
  const showPrintBankInvoiceButton = allowCancellation && bankInvoiceUrl
  const packages = packagify(order)
  const hasProductChanges = changesAttachment && changesAttachment.changesData
  const hasReplacement = props.history && props.history.length > 0

  
  const itemsNoCanceled = items.filter((item) => !item.isCanceled);
  const itemsCanceled = items.filter((item) => item.isCanceled);

  const CancelOrderButton = allowCancellation ? (
    <Link className="no-underline flex bg-muted-3 pv5 ph6 dark-gray" to={`/pedidos/seleccionar-articulos/${order.orderId}`}>
        <FormattedMessage id="order.cancelOrder"  />
    </Link>
  ) : null

  return renderWrapper(
    <div className="center w-100">
      <div className="center w-100 flex">
        <div className=" w-30 w-40-ns pv3 pl0">
          <time className="c-on-bas">
            <div className="pb3 f5 fw7 c-muted-2">
              <FormattedMessage id="order.status" />
            </div>
            <div className="myo-order-id flex justify-start f6 pb3 fw7 c-emphasis">
              No. {order.orderId}
            </div>
          </time>
        </div>

        <div className="w-40 w-40-ns pv3-ns pr0 f6">
          <div className="fw6 pb3">
            <StatusBadge order={order} />
          </div>
          <>
            <span className="fw4 c-muted-2 pb3">
              <FormattedMessage id="order.dateIs"/> {' '}
            </span>
            <span className="fw6 c-muted-3 pb3">
              <FormattedDate date={creationDate} style="long" />
            </span>
          </>
        </div>

        <div className="w-30 w-40-ns pv3-ns pr0 f6 items-end justify-end flex">
          <span className="fw4 c-muted-2 pb3">
            <FormattedMessage id="order.sellerName" />{' '}
          </span>
          <span className="fw6 c-muted-3 pb3">&nbsp;{sellers[0].name} </span>
        </div>
      </div>
      
      <div className="center w-100 ba flex flex-column bw1 b--muted-4">

        <TrackingSteaper status={status} packageAttachment={order.packageAttachment} />

        <section className="w-100 fl mt5 mb2-l mb2-xl flex">
        <article className="w-100 w-third-m">
            <section className="pa5 b--muted-5 h4-plus overflow-y-scroll flex flex-column items-start">
              <h3 className="c-muted-2 mv4 f6">
                <FormattedMessage id="order.deliveryType" />
              </h3>
              <div className="mt2">
                {logisticsShipping[0].selectedSla}
              </div>
            </section>
          </article>
          <article className="w-100 w-third-m">
            <section className="pa5 b--muted-5 h4-plus overflow-y-scroll flex flex-column items-start">
              <h3 className="c-muted-2 mv4 f6">
                <FormattedMessage id="order.shippingInfo" />
              </h3>
              <Address address={address} />
            </section>
          </article>
          <article className="w-100 w-third-m">
            <section className="pa5 b--muted-5 overflow-y-scroll h4-plus flex flex-column items-start">
              <h3 className="c-muted-2 mv4 f6">
                <FormattedMessage id="order.paymentInfo" />
              </h3>
              <div>
                <span className="mt2">{transactions[0].payments[0].paymentSystemName}</span>
              </div>
              {/* Mario Servicios */}
              {/* {!order.hitch && (
                <>
                  {payment.paymentSystem !== '203' && (
                    <div className={styles.headerResum}>
                      <span>Monto de pago</span>
                      <br />
                      <strong>$ {currency(order.value / 100)}.00</strong>
                    </div>
                  )}
                  <div className={styles.headerResum}>
                    <span>
                      Número de pagos:
                      <strong>
                        {' '}
                        {order.paymentData.transactions[0].payments[0].installments}
                      </strong>
                    </span>
                  </div>
                  <div className={styles.headerResum}>
                    <strong>{paymentInfo(order.paymentData.transactions[0].payments[0])}</strong>
                  </div>
                </>
              )} */}
              
              {/* {paymentData &&
                paymentData.transactions.length > 0 &&
                paymentData.transactions[0].payments.map(
                  ({
                    paymentSystemName,
                    id,
                    giftCard,
                    group,
                    lastDigits,
                    value,
                    installments,
                    connectorResponses,
                  }) => (
                    <div className="mb5" key={id}>
                      <PaymentFlagIcon
                        alignFix
                        type={paymentSystemName}
                        size={400}
                        group={group}
                      />
                      <div className="dib ma0 pa0 f6 lh-copy">
                        <Fragment>
                          <FormattedMessage
                            id={
                              giftCard
                                ? `paymentData.giftCard.${giftCard.name}.name`
                                : `paymentData.paymentGroup.${group}.name`
                            }
                            defaultMessage={paymentSystemName}
                          />
                          {group === 'creditCard' && (
                            <span>
                              {` ${intl.formatMessage({
                                id:
                                  'paymentData.paymentGroup.creditCard.endingIn',
                              })} ${lastDigits}`}
                            </span>
                          )}
                        </Fragment>
                        &nbsp;
                        <div className={group === 'creditCard' ? 'db' : 'dib'}>
                          <Price value={value} currency={currencyCode} />
                          <span className="fw5">{` (${installments} x)`}</span>
                        </div>
                        {Object.keys(connectorResponses || {}).length > 0 && (
                          <PaymentConnectorResponses
                            data={connectorResponses || {}}
                            isOpen={showAdditionalPaymentData}
                            onClick={handleAdditionalPaymentDataClick}
                          />
                        )}
                      </div>
                    </div>
                  )
                )} */}
            </section>
          </article>
        </section>
      </div>
      <div className="flex justify-end items-center pv7">
        {CancelOrderButton}
      </div>
        

      {packages.map((deliveryPackage, index) => {


        //packageAttachment logica
        let packagesAux = {};
        order.packageAttachment.packages.forEach((pack, i) => {
          if (!packagesAux.hasOwnProperty(pack.trackingNumber)) {
            packagesAux[pack.trackingNumber] = {
              courier: pack.courier,
              items: [],
              deliveredDate: pack.courierStatus && pack.courierStatus.deliveredDate ,
              trackingNumber: pack.trackingNumber,
              trackingUrl: getTrackingLink(pack.courier, pack.trackingNumber)
            };
          }

          pack.items.forEach((item) => {
            const orderItem = order.items[item.itemIndex];
            if (orderItem && !orderItem.isCanceled) {
              packagesAux[pack.trackingNumber].items.push(orderItem);
            }
          });
        });
        const packagesArray = Object.getOwnPropertyNames(packagesAux).sort();
        const packagesMap = packagesArray.map((p, index) => {
          const pack = packages[p];
          return (
            <div key={index}>
              {pack.items.length > 0 && (
                <div className={styles.productsContainerGeneral}>
                  {pack.items.map((item) => (
                    <ItemDetail key={item.id} {...{ ...item, status }} />
                  ))}
                  <div className={styles.deliveryWrapper}>
                    <div className={`${styles.deliveryHeader} ${styles[breakpoint]}`}>
                      {order.shippingData.logisticsInfo[0].selectedSla !== 'Recoger en Tienda' && (
                        <div className={styles.courier}>
                          <div className={styles.line}>
                            En proceso de entrega con <div className={styles.data}>{pack.courier}</div>
                          </div>
                          <div className={styles.line}>
                            No. Guía: <div className={styles.data}>{pack.trackingNumber}</div>
                          </div>
                        </div>
                      )}
                      {pack.trackingUrl && (
                        <a
                          target="_blank"
                          href={pack.trackingUrl}
                          rel="noopener noreferrer"
                          className={styles.buttonTrack}>
                          Ir al sitio de la paquetería
                        </a>
                      )}
                    </div>
                    {/*orderStatus.index < 5 && !!pack.courier && (
                      <div className={styles.deliveryText}>
                        Recíbelo entre <b>8-12 Jun</b>
                      </div>
                    )*/}
                    {orderStatus.index >= 5 && (
                      <div className={styles.deliveryText}>
                        Entregado el <b>{formatDate(pack.deliveredDate)}</b>
                      </div>
                    )}
                    <div className={styles.deliveryStatus}>
                      <div
                        className={`${styles.statusBlock} ${styles[breakpoint]} ${
                          orderStatus.index >= 4 ? styles.past : styles.gray
                        }`}>
                        <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                          <span>Enviado</span>
                        </div>
                      </div>
                      <div
                        className={`${styles.centralBar} ${styles[breakpoint]} ${
                          orderStatus.index >= 5 ? styles.past : styles.gray
                        }`}
                      />
                      <div
                        className={`${styles.statusBlock} ${styles[breakpoint]} ${
                          orderStatus.index >= 5 ? styles.past : styles.gray
                        }`}>
                        <div className={`${styles.statusText} ${styles[breakpoint]}`}>
                          <span>Entregado</span>
                        </div>
                      </div>
                    </div>
                    {/*pack.courier === 'ektnvia' && (
                      <div className={styles.statusTableWrapper}>
                        {(isPhone && <div className={styles.statusTableContainer}></div>) || (
                          <div className={styles.statusTableContainer}>
                            <table className={styles.statusTable}>
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Estatus</th>
                                  <th>Ubicación</th>
                                  <th>Fecha y hora</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>Envío recolectado</td>
                                  <td>Cedis Tepoztlán</td>
                                  <td>1 junio de 2020 a las 16:30 hrs.</td>
                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td>Producto en tránsito</td>
                                  <td>En tránsito</td>
                                  <td>2 junio de 2020 a las 16:30 hrs.</td>
                                </tr>   
                                <tr>
                                  <td>3</td>
                                  <td>
                                    Producto dañado<span className={styles.statusTableAsterisk}>*</span>
                                  </td>
                                  <td>En tránsito</td>
                                  <td>8 junio de 2020 a las 6:00 hrs.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                        {true && (
                          <div className={styles.statusTableError}>
                            *Tuvimos un incidente con tu pedido, te contactaremos para solucionar tu caso
                            en las próximas horas.
                          </div>
                        )}
                      </div>
                        )*/}
                  </div>
                </div>
              )}
            </div>
          );
        });
        //packageAttachment logica

        return (
          <div
            className="w-100 fl"
            key={`${deliveryPackage.selectedSla}_${index}`}
          >
            <div className="flex flex-column">
              {/* <div className="mw-100 myo-margin-right">
                <h2 className="f4 mb0 lh-copy">
                  <FormattedMessage id="order.package.heading" />
                  {packages.length > 1 && (
                    <span>
                      {` ${index + 1} `}
                      <FormattedMessage id="order.package.numbering" />{' '}
                      {packages.length}
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex flex-column flex-row-l">
                <div>
                  {shippingEstimate && (
                    <span className="mr3">
                      {shippingEstimate.startDateUtc ? (
                        <span>
                          {props.intl.formatMessage(
                            {
                              id: `order.shippingEstimate${
                                isPickup ? '.pickup' : ''
                              }.window`,
                            },
                            {
                              date: props.intl.formatDate(
                                shippingEstimate.startDateUtc,
                                {
                                  // IMPORTANT: if the selected shipping option has a delivery window,
                                  // the time MUST be displayed with UTC.
                                  day: '2-digit',
                                  month: 'long',
                                  timeZone: 'UTC',
                                  weekday: 'long',
                                }
                              ),
                              startHour: props.intl.formatTime(
                                shippingEstimate.startDateUtc,
                                // IMPORTANT: if the selected shipping option has a delivery window,
                                // the time MUST be displayed with UTC.
                                { timeZone: 'UTC' }
                              ),
                              endHour: props.intl.formatTime(
                                shippingEstimate.endDateUtc,
                                // IMPORTANT: if the selected shipping option has a delivery window,
                                // the time MUST be displayed with UTC.
                                { timeZone: 'UTC' }
                              ),
                            }
                          )}
                        </span>
                      ) : (
                        shippingEstimate.label ||
                        (shippingEstimate.isEstimateInHoursOrMinutes ? (
                          <span className="ib">
                            {props.intl.formatMessage(
                              {
                                id: `order.shippingEstimate${
                                  isPickup ? '.pickup' : ''
                                }.withTime`,
                              },
                              {
                                date: props.intl.formatDate(
                                  shippingEstimate.date,
                                  // IMPORTANT: shippingEstimateDate should be displayed with the
                                  // the current browser timezone. NOT UTC!
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                  }
                                ),
                                // IMPORTANT: shippingEstimateDate should be displayed with the
                                // the current browser timezone. NOT UTC!
                                hour: props.intl.formatTime(
                                  shippingEstimate.date
                                ),
                              }
                            )}
                          </span>
                        ) : (
                          props.intl.formatMessage(
                            {
                              id: `order.shippingEstimate${
                                isPickup ? '.pickup' : ''
                              }.noTime`,
                            },
                            {
                              date: props.intl.formatDate(
                                shippingEstimate.date,
                                {
                                  timeZone: 'UTC',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit',
                                }
                              ),
                            }
                          )
                        ))
                      )}
                    </span>
                  )}
                  <span className="dib br2 pv2 mt2 ph3 f7 f6-xl fw5 nowrap bg-muted-1 c-on-muted-1">
                    {getDeliveryName(deliveryPackage)}
                  </span>
                </div>
                <div className="w-40-l w-40-xl w-100-m w-100-s pl6-l">
                  <PackageStatus
                    status={status}
                    pack={deliveryPackage.package || {}}
                    packages={packages}
                    render={i => (
                      <PackageProgressBarSection
                        states={generatePackageProgressBarStates(
                          packageProgressBarStates,
                          i,
                          deliveryPackage.package
                        )}
                        currentState={i}
                      />
                    )}
                  />
                </div>
              </div> */}

              {deliveryPackage.package &&
                deliveryPackage.package.courierStatus && (
                  <TrackingProgress
                    courierStatus={deliveryPackage.package.courierStatus}
                  />
                )}

              {deliveryPackage.package &&
                deliveryPackage.package.trackingNumber && (
                  <TrackingDataSpoiler
                    trackingUrl={deliveryPackage.package.trackingUrl}
                    trackingNumber={deliveryPackage.package.trackingNumber}
                  />
                )}

              {deliveryPackage.package &&
                deliveryPackage.package.invoiceUrl && (
                  <InvoiceDataSpoiler
                    invoiceUrl={deliveryPackage.package.invoiceUrl}
                  />
                )}
            </div>

            {/*Mario Modluo elektra*/}

            {
              packagesArray.length > 0 ? packagesMap : 
              <div className="center w-100 ba flex flex-column bw1 b--muted-4">
              {itemsNoCanceled.map((item) => (
                <ItemDetail key={item.id} {...{ ...item, status }} currencyCode={currencyCode} />
              ))}
              </div>
            }
            
            {!!itemsCanceled.length && (
              <div className={``}>
                Solicitud de cancelación
              </div>
            )}
            {!!itemsCanceled.length && (
              <div className="">
                {itemsCanceled.map((item) => (
                  <span>Hay items Cancelados</span>
                ))}
              </div>
            )}

            {/*Mario Modluo elektra*/}


            {/* {(hasProductChanges || hasReplacement) && (
              <div className="w-100 mv7 fl">
                <h2 className="f4 ttu">
                  <FormattedMessage id="order.history" />
                </h2>
                {hasProductChanges && (
                  <ChangesHistory
                    changes={changesAttachment.changesData}
                    items={items}
                    totals={totals}
                    currencyCode={currencyCode}
                    creationDate={creationDate}
                  />
                )}
                {hasReplacement && (
                  <ReplacementHistory history={props.history} />
                )}
              </div>
            )} */}
          </div>
        )
      })}
        <div className="flex justify-end w-100 pv6 items-center">
          Total: <span>{` $${currency(order.value / 100)}`}</span>
        </div>
    </div>
  )
}
  

ViewOrder.propTypes = {
  history: PropTypes.array,
  match: ReactRouterPropTypes.match.isRequired,
  order: PropTypes.object,
  orderError: PropTypes.object,
  fetchOrder: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  fetchParentOrders: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  intl: intlShape,
}

const mapStateToProps = (state, ownProps) => ({
  order: OrderUtils.mapOrder(
    state.myOrders.detailedOrders[ownProps.match.params.orderId]
  ),
  orderError: state.myOrders.orderError,
  history: OrderUtils.getReplacementHistory(
    state.myOrders.detailedOrders[ownProps.match.params.orderId],
    state.myOrders.parentOrders
  ),
  isLoading: state.myOrders.isLoading,
})

export default connect(mapStateToProps, {
  fetchOrder,
  fetchParentOrders,
  fetchOrders,
})(injectIntl(ViewOrder))
