import React, { Component, Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import ReactRouterPropTypes from 'react-router-prop-types'
import packagify from '@vtex/delivery-packages'
import {
  ContentWrapper,
  utils,
  ProgressBarBundle,
} from 'vtex.my-account-commons'

import { OrderUtils } from '../../utils'
import Address from '../../components/commons/Address'
import Price from '../../components/commons/FormattedPrice'
import FormattedDate from '../../components/commons/FormattedDate'
import PaymentFlagIcon from '../../components/commons/PaymentFlagIcon'
import PaymentConnectorResponses from '../../components/commons/PaymentConnectorResponses'
import StatusBadge from '../../components/commons/StatusBadge'
import TrackingDataSpoiler from '../../components/commons/TrackingDataSpoiler'
import OrderButtons from '../../components/ViewOrder/OrderButtons'
import ReplacementHistory from '../../components/ViewOrder/ReplacementHistory'
import ChangesHistory from '../../components/ViewOrder/ChangesHistory'
import getDeliveryName from '../../utils/getDeliveryName'
import {
  fetchOrder,
  fetchParentOrders,
  fetchOrders,
} from '../../actions/order-actions'
import Totals from '../../components/Order/Totals'
import Error from '../../components/commons/Error'
import Spinner from '../../components/commons/Spinner'
import Products from '../../components/Order/Products/index'
import TrackingProgress from '../../components/commons/TrackingProgress'
import InvoiceDataSpoiler from '../../components/commons/InvoiceDataSpoiler'

import uniq from 'lodash/uniq'
import map from 'lodash/map'
import flatten from 'lodash/flatten'

import TrackingSteaper from '../../components/Order/TrackingSteaper'
import ItemDetail from '../../components/ItemDetail'


const { estimateShipping } = utils
const {
  ProgressBarSection,
  PackageProgressBarSection,
  OrderStatus,
  PackageStatus,
  utils: { generatePackageProgressBarStates, generateProgressBarStates },
  constants: { progressBarStates, packageProgressBarStates },
} = ProgressBarBundle

const headerConfig = ({ order, intl }) => {
  const orderTitle = intl.formatMessage({ id: 'orders.title' })
  const orderNumber = order && order.orderId ? `#${order.orderId}` : ''
  const backButton = {
    title:
      order && order.orderId
        ? intl.formatMessage(
            { id: 'orders.edit' },
            { orderNumber: order.orderId }
          )
        : orderTitle,
    path: order && order.orderId ? `/orders/${order.orderId}` : '/orders',
  }

  return {
    title: `No. ${orderNumber}`,
    backButton,
    namespace: 'vtex-account__edit-order',
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
    window.browserHistory.push('/orders')
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
          {/* <Totals
            totals={totals}
            currencyCode={currencyCode}
            transactions={paymentData.transactions}
          /> */}
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

      {packages.map((deliveryPackage, index) => {
        const shippingEstimate =
          deliveryPackage.deliveryWindow || estimateShipping(deliveryPackage)
        const isPickup = deliveryPackage.deliveryChannel === 'pickup-in-point'

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

        console.log(order)
        return (
          <div
            className="w-100 pv7 fl"
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
