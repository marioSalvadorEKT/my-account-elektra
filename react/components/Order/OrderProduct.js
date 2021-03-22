import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UnitPrice from '../commons/UnitPrice'
import ProductImage from '../commons/ProductImage'
import Estimate from './Estimate'
import ProductQuantity from '../commons/ProductQuantity'
import Price from '../commons/FormattedPrice'

const OrderProduct = (props) => {
  const {
    product: {
      imageUrl,
      name,
      detailUrl,
      shippingEstimate,
      shippingEstimateDate,
      unitMultiplier,
      quantity,
      measurementUnit,
      sellingPrice,
      listPrice
    },
    currency
  } = props

  console.log(props.product)
  return (
    <div className="myo-order-product w-100 pb2 pt2 overflow-y-hidden">
      <div className="v-top dib w-20 h-auto">
        <ProductImage url={imageUrl} alt={name} />
      </div>
      <div className="dib w-60 pl3 c-on-base f6 fw4 lh-copy">
        <h4 className="db mb1 mt0">
          <a
            href={detailUrl}
            className="c-link hover-c-link c-link--visited fw4 f6 f5-l link"
            rel="noopener noreferrer"
            target="_blank"
          >
            {name}
          </a>
        </h4>
        <span className="db mt0 mb2 f6 fw6">
          <span className="pr3">
            <ProductQuantity
              measurementUnit={measurementUnit}
              quantity={quantity}
              unitMultiplier={unitMultiplier}
            />
          </span>
          <p className="db mt1 f6">
            <Estimate
              shippingEstimate={shippingEstimate}
              shippingEstimateDate={shippingEstimateDate}
            />
          </p>
        </span>
      </div>
      <div className="dib w-20 pl3 c-on-base f6 fw4 lh-copy">
        <div className="dib">
          <div className="strike" >
            <Price value={listPrice} currency={currency}/>
          </div>
          <br/>
          <UnitPrice
            value={sellingPrice}
            currency={currency}
            measurementUnit={measurementUnit}
            unitMultiplier={unitMultiplier}
          />
        </div>
      </div>
    </div>
  )
}

OrderProduct.propTypes = {
  product: PropTypes.object,
  currency: PropTypes.string,
}

export default OrderProduct
