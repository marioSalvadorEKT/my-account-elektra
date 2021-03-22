import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import { FormattedMessage, FormattedDate } from 'react-intl'

import arrow from '../../../images/icons/arrow-up.svg'
import slugify from '../../../utils/slugify'

const ATTACHMENT_DATE_VALUES = [
  'vtex.subscription.key.validity.begin',
  'vtex.subscription.key.validity.end',
]

function getFormattedSubscriptionKey(key) {
  return (
    <FormattedMessage
      id={key.replace('vtex.', 'order.')}
      defaultMessage={key}
    />
  )
}

function getFormattedSubscriptionValue(key, value) {
  if (ATTACHMENT_DATE_VALUES.includes(key)) {
    return <FormattedDate value={new Date(value)} />
  }

  const valueParts = value.trim().split(' ')
  let [interval, periodicity] = valueParts

  // if received 'monthly'/'weekly'/etc, transform into '1 {period}'
  if (periodicity == null && interval) {
    periodicity = interval
    interval = 1
  }
  periodicity = periodicity.replace(/(ly|s)$/, '')

  return (
    <FormattedMessage
      defaultMessage={value}
      id={`order.subscription.periodicity.${periodicity}ly`}
      values={{ count: parseInt(interval, 10) }}
    />
  )
}

const Attachment = ({ name, content }) => {
  const slugName = slugify(name)

  const isGiftWrap = name === 'message' && content.text
  if (isGiftWrap) {
    return (
      <tr
        className={`myo-attachment myo-attachment-gift-wrap myo-attachment-${slugName}`}
      >
        <td className="pa0 pv5 v-mid overflow-hidden">
          <div className="ml3 fl overflow-hidden w-80-ns">
            <blockquote className="gift-message">{content.text}</blockquote>
          </div>
        </td>
        <td className="dn dtc-ns" />
        <td />
        <td className="pa0 pv5 v-mid" />
      </tr>
    )
  }

  const isSubscription = name.indexOf('vtex.subscription') === 0

  const attachmentTitle = isSubscription ? (
    <FormattedMessage id="order.subscription" />
  ) : (
    name
  )

  const attachmentInfo = map(content, (value, key) => {
    const elementKey = `${key}-${value}-${name}`
    const shouldNotDisplay = isSubscription && !value

    if (shouldNotDisplay) {
      return <div key={elementKey} className="dn" />
    }

    let formattedKey = key
    let formattedValue = value

    if (isSubscription) {
      formattedKey = getFormattedSubscriptionKey(key)
      formattedValue = getFormattedSubscriptionValue(key, value)
    }

    const mainClassName = `myo-attachment-${slugify(name)}-${slugify(key)}`
    return (
      <div key={elementKey} className={`${mainClassName} pb2`}>
        <span className="myo-attachment-key fw7">{formattedKey}:&nbsp;</span>
        <span className="myo-attachment-value">{formattedValue}</span>
      </div>
    )
  })

  return (
    <tr className={`myo-attachment myo-attachment-${slugName} bg-muted-5`}>
      <td className="pv3 tl v-top v-mid relative">
        <div className="ml9-ns mt3 fl w-80-ns">
          <img
            src={arrow}
            alt=""
            className="absolute"
            style={{ top: '-1px' }}
          />
          <p className="myo-attachment-name f5 mb0">{attachmentTitle}</p>
          <div className="pt5">{attachmentInfo}</div>
        </div>
      </td>
      <td className="pv3 tl v-top dn dtc-ns" />
      <td />
      <td className="pv3 tl v-top v-mid" />
    </tr>
  )
}

Attachment.propTypes = {
  name: PropTypes.string,
  content: PropTypes.object,
}

export default Attachment
