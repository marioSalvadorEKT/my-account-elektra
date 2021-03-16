import PropTypes from 'prop-types'
import React from 'react'
import { FormattedNumber } from 'react-intl'

const ProductQuantity = ({ quantity, unitMultiplier, measurementUnit }) => {
  const qtd = quantity * unitMultiplier
  return (
    <>
      <FormattedNumber value={qtd} maximumFractionDigits={3} />{' '}
      {measurementUnit}
    </>
  )
}

ProductQuantity.propTypes = {
  quantity: PropTypes.number,
  unitMultiplier: PropTypes.number,
  measurementUnit: PropTypes.measurementUnit,
}

export default ProductQuantity
