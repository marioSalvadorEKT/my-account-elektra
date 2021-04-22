import React from 'react';
import styles from './index.css';

const Breadcrumb = ({type}) => {
  const breakpoint = "desktop"
  const statusCanceled = type;

  return (
    <section>
      <div className={styles.breadcrumb}>
        <div>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'selectProducts' ||
              statusCanceled === 'canceled') &&
              styles.dotActive) ||
              styles.dot}`}
          />
        </div>
        <div
          className={`${((statusCanceled === 'startCancelation' || statusCanceled === 'canceled') &&
            styles.lineActive) ||
            styles.line} ${styles[breakpoint]}`}>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'selectProducts' ||
              statusCanceled === 'canceled') &&
              styles.labelActive_bread) ||
              styles.label_bread} ${styles[breakpoint]}`}>
            Selecciona
          </div>
        </div>
        <div>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'canceled') &&
              styles.dotActive) ||
              styles.dot}`}
          />
        </div>
        <div
          className={`${statusCanceled === 'canceled' ? styles.lineActive : styles.line} ${
            styles[breakpoint]
          }`}>
          <div
            className={`${((statusCanceled === 'startCancelation' ||
              statusCanceled === 'canceled') &&
              styles.labelActive_bread) ||
              styles.label_bread} ${styles[breakpoint]}`}>
            Motivo de cancelación
          </div>
          <div
            className={`${(statusCanceled === 'canceled' && styles.labelEndActive) ||
              styles.labelEnd} ${styles[breakpoint]}`}>
            Cancelación enviada
          </div>
        </div>
        <div>
          <div className={(statusCanceled === 'canceled' && styles.dotActive) || styles.dot} />
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
