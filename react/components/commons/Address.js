import React from 'react'
import PropTypes from 'prop-types'
import AddressSummary from '@vtex/address-form/lib/AddressSummary'
import AddressRules from '@vtex/address-form/lib/AddressRules'

const Address = ({ address }) => {
  return (
    <div className="lh-copy f7 c-muted-1">
      <strong>{address.receiverName}</strong>
      <br />
      <AddressRules country={address.country} shouldUseIOFetching>
        <AddressSummary address={address} />
      </AddressRules>
    </div>
  )
}

Address.propTypes = {
  address: PropTypes.object.isRequired,
}

export default Address
