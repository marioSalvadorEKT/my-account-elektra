import React from 'react';
import styles from './index.css';
import Breadcrumb from '../../components/EditOrder/Breadcrumb'
import getIcon from './Icons/index.js';

const OrderCanceled = ({ state, actions, props }) => {
  const urlValue = props.location.pathname.split('/');
  const folioCancelled = urlValue[3];
  const breakpoint = state.__states.breakpoint;
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const { firstName = '' } = state.clientProfileData;
  const { email = '' } = state.clientProfileData;
  const order = urlValue[2];

  return (
    <div id={styles.container}>
      <div className={`${styles.containerCancelation} ${styles[breakpoint]}`}>
        <Breadcrumb type="canceled" order={order} />
        <div className={`${styles.orderCanceledBody} ${styles[breakpoint]}`}>
          <div className={`${styles.Cancelation_canceled} ${styles[breakpoint]}`}>
            <div className={`${styles.userData} ${styles[breakpoint]}`}>
              <div className={styles.name_canceled}>{firstName}</div>
              <div className={styles.description_canceled}>
                Tu solicitud de cancelación fue enviada, tu folio de seguimiento es:
              </div>
              <div className={`${styles.cancelId} ${styles[breakpoint]}`}>{folioCancelled}</div>
              <div className={styles.description_canceled}>
                Enviaremos la respuesta a <span>{email}</span> en un máximo de 3 horas
              </div>
            </div>
            <div className={`${styles.imageCancelation} ${styles[breakpoint]}`}>
              {isMobile && getIcon('line')}
              {!isMobile && getIcon('plane')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCanceled;
