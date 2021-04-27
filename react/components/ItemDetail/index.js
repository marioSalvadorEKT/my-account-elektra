import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../../components/commons/ProductPrice'
import  currency from '../../utils/currency';
import  amount from '../../utils/amount';


const ItemDetail = (props, currencyCode) => {
  const 
    {
      name,
      imageUrl,
      quantity,
      detailUrl,
      breakpoint,
      orderStatus,
      price,
      folio,
      isCanceled,
      isTotalCancelation,
      sellingPrice,
      orderId,
      deliveryEnd,
      deliveryStart
    } = props
  
  return (
    <div className="flex ">
      <div className="flex pa4 w-100 bt  bw1 b--muted-4 items-center ph7">
        <div className="tc f6">
          <img src={imageUrl} alt={name} />
        </div>
        <div className="flex items-center w-100 ml6">
          <div className="w-50 b f6">
            <a href={detailUrl} className="no-underline c-muted-1">{name}</a>
            <br />
            {!!deliveryStart && !!deliveryEnd && orderStatus.index !== 5 && (
              <p className="">
                {'Recíbelo entre '}
                <strong>{`${deliveryStart} y ${deliveryEnd}`}</strong>
              </p>
            )}
          </div>
          <div className="w-50 flex justify-end">
            <span className="tc w-20 f6 c-muted-1 b">
              {quantity} pza{quantity > 1 ? 's' : ''}
            </span>
            <div className="w-40 tr">
              {(isCanceled && (
                <Link to={`./order-canceled/${orderId}/${folio}`}>
                  <span>{folio}</span>
                </Link>
              )) || (
                <span className="f6 c-muted-1 b">
                  <span>{`$ ${currency(amount(sellingPrice))}`}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/*orderStatus.index === 5 && (
         <div className={`${styles.trackingProduct} ${styles[breakpoint]}`}>
           <div className={`${styles.delivered} ${styles[breakpoint]}`}>
             <div className={`${(folio && styles.circleCancel) || styles.circle}`}>
               <span className={`${(folio && styles.sendGray) || styles.send}`}>Enviado</span>
             </div>
             <div
               className={`${(folio && styles.lineCanceled) || styles.line} ${styles[breakpoint]}`}
             />
             <div
               className={`${(folio && styles.circle2Canceled) || styles.circle2} ${
                 styles[breakpoint]
               }`}>
               {(folio && (
                 <span className={`${(folio && styles.sendGray) || styles.send}`}>En proceso</span>
               )) || <span>Entregado</span>}
             </div>
           </div>
         </div>
               )*/}
    </div>
  );
};

export default ItemDetail;
