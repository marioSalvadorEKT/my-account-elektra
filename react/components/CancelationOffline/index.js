import React, { useState, useContext, useEffect } from 'react';
import queryString from 'query-string';
import DropDown from '../commons/DropDown';
import TextareaField from '../commons/TextAreaField';
import DateField from '../commons/DateField';

import styles from './index.css';
import Requirements from './Requirements/';
import ConfirmCancellation from '../../components/ConfirmCancellation';
import CancellationNotAllowed from '../../components/CancellationNotAllowed';
import Moment from 'moment';
import { Context }  from '../../actions/account/index';
import TextField from '../commons/TextField';
import inputMethods from '../../hooks/useFieldForm';
import format  from '../../actions/utils/format';
import { Link } from 'react-router-dom';
import Breadcrumb from '../EditOrder/Breadcrumb'

const { useField, validateData } = inputMethods;
const CancelationOffline = ({state, actions, props}) => {

  const [showPopup, setShowPopup] = useState(false);
  const [isFetched, setisFeched] = useState(false);
  const url = queryString.parse(props.location.search);
  const urlParams = queryString.parse(props.location.search, { parseBooleans: true });
  const orderId = url.orderId;
  const search = props.location.search;
  const isTotalCancelation = urlParams.isTotalCancelation;

  /* console.log(state)
  console.log(actions)
  console.log(props) */
  useEffect(() => {
    actions.getCauses(orderId);
  }, []);

  

  const { causes } = state.selfService || [];
  const aplyMtcn = urlParams.mtcn;
  const items = (!Array.isArray(urlParams.items) && [urlParams.items]) || urlParams.items;
  const cause = useField({
    id: 'cause',
    name: 'cause',
    value: props.cause || ''
  });

  const comments = useField({
    id: 'comments',
    name: 'comments',
    validateEvent: 'blur',
    value: props.comments || '',
    required: cause.input.value === '9811',
    minlength: 8,
    maxlength: 300,
    errors: {
      requiredError:
        'Es necesario que lo especifiques en el campo de comentarios para enviar tu solicitud de cancelación.'
    }
  });

  const mtcnName = useField({
    id: 'mtcnName',
    name: 'mtcnName',
    validateEvent: 'blur',
    value: props.mtcnName || '',
    required: !!aplyMtcn,
    minlength: 8,
    maxlength: 200,
    errors: {
      requiredError: 'Este campo es obligatorio'
    }
  });

  const mtcnBirthday = useField({
    id: 'mtcnBirthday',
    name: 'mtcnBirthday',
    required: !!aplyMtcn,
    value: new Date(),
    validateEvent: 'change',
    customValidation: (value) => {
      if (!aplyMtcn) return true;
      const end = new Date(value);
      format('DD de MM de YYYY', end, true);
      var years = Moment().diff(end, 'years', false);
      return years >= 18;
    },
    errors: {
      defaultError: 'Confirma que eres mayor de 18 años'
    }
  });
  const handleCancelSubmit = () => {
    const validatedFields = validateData([comments, cause, mtcnName, mtcnBirthday]);
    if (!validatedFields.errors || (!validatedFields.errors.length && state.order)) {
      setisFeched(true);
      actions
        .cancelationOrder({ orderId, comments, aplyMtcn, items, fields: validatedFields.data })
        .then((response) => {
          setisFeched(false);
          if (
            response &&
            response.data &&
            response.data.selfService &&
            response.data.selfService.cancelation &&
            response.data.selfService.cancelation.id
          )
            props.history.push(
              `/pedido-cancelado/${orderId}/${response.data.selfService.cancelation.id}`
            );
        });
    }
  };

  return (
    <div>
      <Breadcrumb type="startCancelation" order={url.order} />
      <div className={styles.cause}>Selecciona el motivo de la cancelación</div>
      <div className={`${styles.dropDown}`}>
        <DropDown input={cause.input}>
          <option value={0}>Motivo de la cancelación (obligatorio)</option>
          {state.__states.fecthCauses &&
            causes &&
            causes.map(({ name, id }, key) => {
              return (
                <option value={id} key={id}>
                  {name}
                </option>
              );
            })}
        </DropDown>
      </div>
      <div className="comments">
        <TextareaField
          label={
            (cause.input.value === '9811' && 'Escribe un comentario (Obligatorio)') ||
            'Escribe un comentario (Opcional)'
          }
          input={comments.input}
        />
      </div>
      {aplyMtcn && <Requirements />}
      {aplyMtcn && (
        <div className={`${styles.userInfo}`}>
          <TextField label="Nombre completo" input={mtcnName.input} />
          <DateField label="Fecha de nacimiento" input={mtcnBirthday.input} />
        </div>
      )}
      <div
        className={`${(isTotalCancelation && styles.wrapperButtonsCancelation) ||
          styles.wrapperButtons}`}>
        {!isTotalCancelation && (
          <Link to={`/pedidos/seleccionar-articulos/${orderId}`}>
            <div className={`${styles.disagreeButton}`}>Atrás</div>
          </Link>
        )}
        <div
          className={`${(cause.input.value !== '0' &&
            cause.input.value !== '' &&
            styles.agreeButton) ||
            styles.agreeButtonDisable} `}
          onClick={() => {
            console.log(comments)
            const validatedFields = validateData([comments, cause, mtcnName, mtcnBirthday]);
            console.log(validatedFields)
            if (!validatedFields.errors || !validatedFields.errors.length) {
              setShowPopup(true);
            }
          }}>
          Enviar solicitud
        </div>
      </div>
      {showPopup && (
        <ConfirmCancellation
          order={orderId}
          isFetched={isFetched}
          onConfirmation={() => handleCancelSubmit()}
          onClose={() => setShowPopup(false)}
        />
      )}
      {/* <CancellationNotAllowed order={orderId} className={styles.cancelNotAllowed} /> */}
    </div>
  );
};

export default CancelationOffline;
