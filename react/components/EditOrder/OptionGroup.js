import React from 'react'
import PropTypes from 'prop-types'

const OptionGroup = ({ name = 'Opções', children }) => {
  return (
    <section className="mv7">
      <h5 className="myo-option-heading f7 tracked c-muted-1 ttu">{name}</h5>
      <ul className="list pa0 ma0">{children}</ul>
    </section>
  )
}

OptionGroup.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any.isRequired,
}

export default OptionGroup
