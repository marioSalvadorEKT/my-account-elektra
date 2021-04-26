import React, { useEffect } from 'react';
import styles from './index.css';
/* import { ReactComponent as Close } from '../../components/icons/close.svg'; */
import { Link } from 'react-router-dom';
import Spinner from '../commons/Spinner';

const ConfirmCancellation = ({ onClose, onConfirmation, isFetched, order }) => {
  useEffect(() => {
    const cancelOnScapeKey = (e) => (e.key === 'Escape' && onClose()) || null;
    window.addEventListener('keyup', cancelOnScapeKey);
    return () => {
      window.removeEventListener('keyup', cancelOnScapeKey);
    };
  }, []);

  return (
    <section className={styles.wrapperPopUpContainer}>
      <div className={`${styles.containerPopup}`}>
        <div className={styles.headerPop}>
          <span>Confirmar cancelación</span>
          {/* <Close onClick={onClose} /> */}
        </div>

        <div className={`${styles.rowPopup}`}>
          {(isFetched && 'Solicitando cancelación.') ||
            '¿Estás seguro que quieres solicitar la cancelación de tus productos?'}
        </div>

        {(isFetched && <Spinner />) || (
          <div className={`${styles.footerPop}`}>
            <Link to={`/pedidos/${order}`}>
              <div
                className={`${styles.cancelPopButton} ${styles.active}`}
                onClick={onClose}>
                No quiero cancelar
              </div>
            </Link>
            <div onClick={onConfirmation} className={`${styles.cancelPopButton} ${styles.acept}`}>
              Si
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConfirmCancellation;
