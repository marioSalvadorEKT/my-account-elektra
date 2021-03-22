import PropTypes from 'prop-types'
import React from 'react'

import ProductPrice from '../../commons/ProductPrice'
import ProductImage from '../../commons/ProductImage'
import UnitPrice from '../../commons/UnitPrice'
import ProductQuantity from '../../commons/ProductQuantity'

const Product = ({
  imageUrl,
  detailUrl,
  name,
  sellerName,
  currencyCode,
  quantity,
  measurementUnit,
  unitMultiplier,
  isGift,
  sellingPrice,
}) => {
  return (
    <tr className="myo-product-row bt b--muted-5 bw1">
      <td className="myo-product-info pv3 tl v-top overflow-hidden">
        <ProductImage
          className="myo-product-image mw4-ns fl mr5"
          url={imageUrl}
          alt={name}
        />
        <div className="fl overflow-hidden w-80-ns lh-copy">
          <p
            href={detailUrl}
            className="myo-product-name fw7 f6 mb0 mt0"
            target="_blank"
          >
            {name}
          </p>
          <span className="myo-seller-name f7 c-muted-1 db">{sellerName}</span>
        </div>
      </td>
      <td className="myo-product-price pl2-ns pt3 tl v-top dn dtc-ns">
        <UnitPrice
          value={sellingPrice}
          currency={currencyCode}
          measurementUnit={measurementUnit}
          unitMultiplier={unitMultiplier}
        />
      </td>
      <td className="myo-product-quantity pl2-ns pt3 tl v-top">
        <ProductQuantity
          unitMultiplier={unitMultiplier}
          quantity={quantity}
          measurementUnit={measurementUnit}
        />
      </td>
      <td className="myo-product-total-price pl1-l pt3 tl v-top">
        <ProductPrice
          value={sellingPrice * quantity}
          isGift={isGift}
          currency={currencyCode}
        />
      </td>
    </tr>
  )
}

Product.propTypes = {
  imageUrl: PropTypes.string,
  detailUrl: PropTypes.string,
  name: PropTypes.string,
  sellerName: PropTypes.string,
  sellingPrice: PropTypes.number,
  currencyCode: PropTypes.string,
  quantity: PropTypes.number,
  unitMultiplier: PropTypes.number,
  measurementUnit: PropTypes.string,
  isGift: PropTypes.bool,
  attachments: PropTypes.array,
}

export default Product
