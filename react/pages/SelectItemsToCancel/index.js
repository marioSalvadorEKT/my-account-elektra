import React, { Component, Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { ContentWrapper } from 'vtex.my-account-commons'

import OptionGroup from '../../components/EditOrder/OptionGroup'
import Option from '../../components/EditOrder/Option'
import Panel from '../../components/commons/Panel'
import OptionGroupDisclaimer from '../../components/EditOrder/OptionGroupDisclaimer'
import GoButton from '../../components/commons/Button'
import Spinner from '../../components/commons/Spinner'
import Error from '../../components/commons/Error'
import Breadcrumb from '../../components/EditOrder/Breadcrumb'
import ListProductsCanceled from '../../components/EditOrder/ListProductsCanceled'
import {
  fetchOrderAndReasons,
  getCancellationReasons,
  fetchOrders,
  cancelOrder,
} from '../../actions/order-actions'

const headerConfig = ({ intl, order }) => {
  const orderTitle = intl.formatMessage({ id: 'order' })
  const orderNumber = order && order.orderId ? `#${order.orderId}` : ''
  const backButton = {
    titleId: 'orders.title',
    path: '/pedidos',
  }
  return {
    title: `Solicitud de cancelación`,
    backButton,
    namespace: 'vtex-account__cancel-order',
  }
}

const CancelOrder = (props) => {

    const {
        intl,
        order,
        match,
        isLoading,
        orderError,
        isSubmitting,
        cancellationOptions,
        cancellationReasonsError,
        hasFetchedCancellationOptions,
      } = props

    const [selectedOption, setSelectedOption] = useState({ label: "", value: ""})
    const [selectedOptionGroup, setSelectedOptionGroup] = useState({ name: "" })
    const [otherReason, setOtherReason] = useState(null)

    const handleCancelOrder = () => {
        let reason
    
        if (value === 'other') {
          reason = otherReason || value
        } else if (value && value.length) {
          reason = value
        } else {
          reason = label
        }
    
        props.cancelOrder(order.orderId, reason)
    }

    const goToHomePage = () => {
        window.browserHistory.push('/orders')
    }
    
    const handleChange = (option, groupName) => {
        setSelectedOption(option);
        setSelectedOptionGroup( props.cancellationOptions.groups.find(
                group => group.name === groupName
            )
        );
        setOtherReason(null)
    }
    
    const handleOtherReasonChange = event => {
        const { value } = event.target
        setOtherReason( value )
    }
    
    const isDisclaimerPanelOpen = (groupName, optionLabel) => {
        return name === groupName && label === optionLabel
    }
    
    const loadOptions = () => {
        if (order.allowCancellation) {
          props.getCancellationReasons(intl.locale, order)
        } else {
          goToHomePage()
        }
    }
    
    const handleCustomerImpersonation = () => {
        props.fetchOrders()
        goToHomePage()
    }

    useEffect(() => {
    
        if (!order) {
          props.fetchOrderAndReasons(
            match.params.orderId,
            intl.locale,
            'cancellation'
          )
        } else {
          loadOptions()
        }
        window.addEventListener(
          'callcenterOperator.setCustomer.vtex',
          handleCustomerImpersonation
        )
        window.scrollTo(0, 0)
        
        return (
            window.removeEventListener('callcenterOperator.setCustomer.vtex', handleCustomerImpersonation)
        )
    }, [])

    useEffect(() => {
        if (match.params.orderId) {
            props.fetchOrderAndReasons(
              match.params.orderId,
              intl.locale,
              'cancellation'
            )
          }
            
          if (order && !order.allowCancellation) {
            goToHomePage()
          }
        return () => {
            window.removeEventListener(
                'callcenterOperator.setCustomer.vtex',
                handleCustomerImpersonation
              )
        }
    }, [match.params.orderId])

    const error = orderError || cancellationReasonsError

    const renderWrapper = children => {
      return (
        <ContentWrapper {...headerConfig({ order, intl })}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (error) {
      return renderWrapper(<Error error={error} />)
    }

    if (isLoading || !order) {
      return renderWrapper(
        <div className="w-100 pt6 tc">
          <Spinner size="small" />
        </div>
      )
    }
    const {
      clientProfileData: { firstName },
    } = order

    const otherReasonTextarea = selectedOption &&
      selectedOption.value === 'other' && (
        <form className="pv5">
          <label className="f6 lh-copy c-on-base" htmlFor="cancelReason">
            <FormattedMessage id="commons.reasonOtherExplanation" />
          </label>
          <textarea
            id="cancelReason"
            autoComplete="off"
            className="w-100 mt2 h4"
            style={{ resize: 'vertical' }}
            onChange={handleOtherReasonChange}
          />
        </form>
      )

    return renderWrapper(
      <div className="center w-100 cf">
        <Breadcrumb type="selectProducts" />
        <ListProductsCanceled order={order} />

        {/* <section className="w-100 w-70-xl fl-xl pr9">
          <p className="f4 c-on-base lh-copy mt7">
            <FormattedMessage id="pages.cancelOrder.greeting" />
          </p>

          {!hasFetchedCancellationOptions && (
            <Fragment>
              <br />
              <Spinner size="small" />
            </Fragment>
          )}

          {hasFetchedCancellationOptions &&
            cancellationOptions.groups.map(optionGroup => (
              <OptionGroup name={optionGroup.name} key={optionGroup.name}>
                {optionGroup.options.map(option => (
                  <div key={option.label}>
                    <Option
                      option={option}
                      groupName={optionGroup.name}
                      id={`${optionGroup.name}-${option.label}`}
                      onChange={handleChange}
                    />
                    {isDisclaimerPanelOpen(
                      optionGroup.name,
                      option.label
                    ) && (
                      <Fragment>
                        {otherReasonTextarea}
                        <Panel>
                          <OptionGroupDisclaimer group={selectedOptionGroup} />
                          <GoButton
                            type="primary"
                            color="danger"
                            onClick={handleCancelOrder}
                            isLoading={isSubmitting}
                          >
                            <FormattedMessage id="order.confirmCancellation" />
                          </GoButton>
                        </Panel>
                      </Fragment>
                    )}
                  </div>
                ))}
              </OptionGroup>
            ))}
        </section> */}
      </div>
    )
}


CancelOrder.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  order: PropTypes.object,
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
  intl: intlShape,
}

const mapStateToProps = (state, ownProps) => ({
  order: state.myOrders.detailedOrders[ownProps.match.params.orderId],
  isLoading: state.myOrders.isLoading,
  orderError: state.myOrders.orderError,
  cancellationOptions: state.myOrders.options,
  hasFetchedCancellationOptions: state.myOrders.hasFetchedCancellationOptions,
  cancellationReasonsError: state.myOrders.cancellationReasonsError,
  isSubmitting: state.myOrders.isSubmittingOrderCancellation,
})

export default connect(mapStateToProps, {
  fetchOrderAndReasons,
  getCancellationReasons,
  fetchOrders,
  cancelOrder,
})(injectIntl(CancelOrder))
