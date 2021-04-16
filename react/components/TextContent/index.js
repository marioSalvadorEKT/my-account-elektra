import React from 'react';

const TextContent = ({ isSent }) => {
  return (
    (isSent && (
      <>
        <span>
          Estimado cliente, tu pedido ya ha sido surtido o ya fue enviado
        </span>
        <p >
          Si lo requieres, puedes solicitar una <b>devolución.</b> <br /> para brindar mayor
          información y realizar el trámite comunícate con nosotros al teléfono <br />
          &nbsp;<b>55 7577 5545</b>
        </p>
      </>
    )) || <span>Por favor, intenta de nuevo en unos minutos</span>
  );
};

export default TextContent;
