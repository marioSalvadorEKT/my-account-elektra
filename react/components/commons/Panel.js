import React from 'react'
import PropTypes from 'prop-types'

const Panel = ({ children }) => (
  <section className="myo-option-disclaimer br2 mv3 pv5 ph7 bg-muted-5 c-on-muted-5">
    {children}
  </section>
)

Panel.propTypes = {
  children: PropTypes.any,
}

export default Panel
