import PropTypes from 'prop-types'
import React  from 'react'
import styles from './index.css'

import getIcon from './icons/OrderIcons';
/* import { TrackingDelivered } from '../../../images/icons/tracking-delivered.svg';
import { TrackingPaid } from '../../../images/icons/tracking-paid.svg';
import { TrackingSent } from '../../../images/icons/tracking-sent.svg'; */

import getStatus from '../../../utils/getStatus'

const TrackingSteaper = props => {
    
  const { status, packageAttachment } = props
  const orderStatus = getStatus(status, packageAttachment);

  return (
      <>
        {orderStatus && orderStatus.index < 6 && (
        <div className={`${styles.statusWraper} `}>
            <div className={`${styles.statusContainer} `}>
            <div
                className={`${styles.statusBlock}  ${
                orderStatus.index >= 0 ? styles.past : styles.gray
                }`}>
                {getIcon('trackingConfirmed')}
                <div className={`${styles.statusText} `}>
                <span>Pedido confirmado</span>
                </div>
            </div>
            <div
                className={`${styles.centralBar}  ${
                orderStatus.index >= 2 ? styles.past : styles.gray
                }`}
            />
            <div
                className={`${styles.statusBlock}  ${
                orderStatus.index >= 2 ? styles.past : styles.gray
                }`}>
                {getIcon('trackingPaid')}
                <div className={`${styles.statusText} `}>
                <span>Pago confirmado</span>
                </div>
            </div>
            <div
                className={`${styles.centralBar}  ${
                orderStatus.index >= 4 ? styles.past : styles.gray
                }`}
            />
            <div
                className={`${styles.statusBlock}  ${
                orderStatus.index >= 4 ? styles.past : styles.gray
                }`}>
                {getIcon('trackingSent')}
                <div className={`${styles.statusText} `}>
                <span>Pedido enviado</span>
                </div>
            </div>
            <div
                className={`${styles.centralBar}  ${
                orderStatus.index >= 5 ? styles.past : styles.gray
                }`}
            />
            <div
                className={`${styles.statusBlock}  ${
                orderStatus.index >= 5 ? styles.past : styles.gray
                }`}>
                {getIcon('trackingDelivered')}
                <div className={`${styles.statusText} `}>
                <span>Pedido entregado</span>
                </div>
            </div>
            </div>
        </div>
        )}
      </>
  )
}

TrackingSteaper.propTypes = {
  status: PropTypes.string,
  packageAttachment: PropTypes.arrayOf(PropTypes.object),
}

export default TrackingSteaper
