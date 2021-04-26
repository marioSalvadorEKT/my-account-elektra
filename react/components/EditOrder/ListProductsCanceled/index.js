import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Spinner from "../../../components/commons/Spinner"

import styles from './index.css';

import currency from '../../../utils/currency'
import amount from '../../../utils/amount'

const ListProductsCanceled = (props) => {
  let totalCanceled = 0;
  const breakpoint = "desktop";
  const params = queryString.parse(window.location.search);
  const isMobile = breakpoint === 'phone' || breakpoint === 'tablet';
  const [productsToCancel, setProductsToCancel] = useState([]);



  if (!props.order) return <Spinner />;

  const items = props.order.items.filter((item) => !item.isCanceled);
  const itemsCanceled = props.order.items.filter((item) => item.isCanceled);

  const handleSelected = (productId) => {
    const productIndex = productsToCancel.indexOf(productId);
    if (productIndex > -1) {
      productsToCancel.splice(productIndex, 1);
      return setProductsToCancel([...productsToCancel]);
    }
    return setProductsToCancel([...productsToCancel, productId]);
  };

  const handleSelectAll = () => {
    if (productsToCancel.length === items.length) return setProductsToCancel([]);
    const ids = items.map((item) => item.productId);
    return setProductsToCancel(ids);
  };

  const handleSelecPrice = () => {
    props.order.items.forEach((val) => {
      productsToCancel.forEach((sku) => {
        if (val.productId === sku) {
          totalCanceled += val.sellingPrice * parseInt(val.quantity);
        }
      });
    });
    return(totalCanceled / 100);
  };

  return (
    <div className={styles.container}>
      <section className={`${styles.containerList} `}>
        <div className={` ${styles.containerItems}`}>
          <div className={` ${styles.title}`}>
            <p>Selecciona el Producto que deseas cancelar</p>
            <div className={` ${styles.selectAll}`}>
              <span className={styles.select}>Seleccionar todo</span>
              <input
                className={styles.cssinput}
                type="checkbox"
                id="checkAllProducts"
                name="checkAllProducts"
                checked={productsToCancel.length === items.length}
                onChange={() => handleSelectAll()}
              />
            </div>
          </div>
          {items.map(
            ({ id, imageUrl, detailUrl, name, quantity, sellingPrice, price, productId }) => {
              // TODO: mover a un componente y homologar en detalle y listado de cancelacion
              return (
                <div key={id} className={styles.item}>
                  <div className={` ${styles.productDetail}`}>
                    <div>
                      <img src={imageUrl} alt={name} />
                    </div>
                    <div className={`${styles.description} `}>
                      <div className={`${styles.productName} `}>
                        <a href={detailUrl}>{name}</a>
                      </div>
                      <div className={`${styles.textDetail}  `}>
                        <div className={` ${styles.quantity}`}>
                          <span>
                            {quantity} pza{quantity > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className={`${styles.subtotal} `}>
                          Subtotal:
                          <span className={styles.selling}>
                          {`$ ${currency(amount(sellingPrice * quantity))}`}
                          </span>
                        </div>
                        <div className={` ${styles.checkBox}`}>
                          <input
                            className={styles.cssinput}
                            type="checkbox"
                            id="checkProduct"
                            name="checkProduct"
                            value={productId || ''}
                            onChange={() => handleSelected(productId)}
                            checked={productsToCancel.includes(productId)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        {isMobile && (
          <div className={`${styles.priceSelectproducts} `}>
            Total a rembolsar: <span>{`$ ${currency(handleSelecPrice())}`}</span>
          </div>
        )}
        <div className={styles.wrapperButtons}>
          <Link to={`/pedidos/${props.order.orderId}`}>
            <div className={`${styles.disagreeButton} `}>
              No quiero cancelar
            </div>
          </Link>
          {!isMobile && (
            <div className={styles.priceSelectproducts}>
              Total a rembolsar: <span>{`$ ${currency(handleSelecPrice())}`}</span>
            </div>
          )}
          <Link
            className={`${(productsToCancel.length && styles.agreeButton) ||
              styles.agreeButtonDisable}  `}
            to={`./${props.order.orderId}/cancelar-mi-pedido?${queryString.stringify({
              orderId: props.order.orderId,
              items: productsToCancel
            })}`}>
            Siguiente
          </Link>
        </div>
        {!!itemsCanceled.length && (
          <div className={`${styles.cancelItems} `}>
            Solicitud de cancelación
          </div>
        )}

        <div className={` ${styles.containerItems}`}>
          {itemsCanceled.map(
            ({
              id,
              imageUrl,
              detailUrl,
              name,
              quantity,
              price,
              productId,
              sellingPrice,
              folio
            }) => {
              // TODO: mover a un componente y homologar en detalle y listado de cancelacion
              return (
                <div key={id} className={styles.item}>
                  <div className={` ${styles.productDetail}`}>
                    <div>
                      <img src={imageUrl} alt={name} />
                    </div>
                    <div className={styles.description}>
                      <div className={styles.productName}>
                        <a href={detailUrl}>{name}</a>
                      </div>
                      <div className={`${styles.textDetail}  `}>
                        <div className={` ${styles.quantity}`}>
                          <span>
                            {quantity} pza{quantity > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className={`${styles.subtotal} `}>
                          <span className={styles.selling}>
                            ${((sellingPrice / 100) * quantity)}
                          </span>
                        </div>
                        <div className={` ${styles.checkBox}`}>
                          {(folio && <div>{folio}</div>) || (
                            <input
                              type="checkbox"
                              id="checkProduct"
                              name="checkProduct"
                              value={productId || ''}
                              onChange={() => handleSelected(productId)}
                              checked={productsToCancel.includes(productId)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
};

export default ListProductsCanceled;
