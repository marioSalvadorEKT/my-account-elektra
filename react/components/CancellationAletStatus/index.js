import React, { useEffect } from 'react';
import styles from './index.css';
import TextContent from '../TextContent';

const CancellationAlertStatus = (props) => {

  useEffect(() => {
    const cancelOnScapeKey = (e) => (e.key === 'Escape' && props.onClose()) || null;
    window.addEventListener('keyup', cancelOnScapeKey);
    return () => {
      window.removeEventListener('keyup', cancelOnScapeKey);
    };
  }, []);

  return (
    <section className={styles.wrapperPopUpNoCancellContainer}>
      <div className={`${styles.containerPopupNoCancel}`}>
        <div className={styles.top} />
        <div className={styles.downTop}>
          <div className={styles.left}>
            <div className={styles.leftBlock}>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rowPopup}>
              <div className={`${styles.popupTextBox}`}>
                <h1>
                  No se ha podido realizar la cancelación <br />
                  del pedido.
                </h1>
                <TextContent isSent={true} />
              </div>
            </div>
            <div className={styles.wrapCancel}>
              <div className={styles.cancelPopButtonDemo} onClick={props.onClose}>
                Cerrar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CancellationAlertStatus;
