import styles from './index.css'
export default function getIcon(icon) {
    switch (icon) {
      // some orders doesn't have a status yet and returns empty
        case 'tag':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={`${styles.orderListIcons}`}>
                <title>tag</title>
                <path d="M24.14 7h-6.88c-0.564 0.020-1.075 0.232-1.473 0.573l0.003-0.003-8.51 8.59c-0.153 0.16-0.247 0.376-0.247 0.615s0.094 0.456 0.247 0.615l7.36 7.36c0.159 0.153 0.376 0.247 0.615 0.247s0.456-0.094 0.615-0.247l8.51-8.51c0.362-0.386 0.593-0.899 0.62-1.465l0-0.005v-6.87c0.005-0.033 0.008-0.072 0.008-0.111 0-0.436-0.354-0.79-0.79-0.79-0.010 0-0.020 0-0.029 0.001l0.001-0zM19.93 13.87c-0.95 0-1.72-0.77-1.72-1.72s0.77-1.72 1.72-1.72c0.95 0 1.72 0.77 1.72 1.72v0c0 0.012 0 0.026 0 0.040 0 0.928-0.752 1.68-1.68 1.68-0.014 0-0.028-0-0.043-0.001l0.002 0z"></path>
                </svg>
            )
        case 'calendar':
            return (
                <svg id="icn-calendario-outline" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" className={`${styles.orderListIcons}`} >
                <title>icn-calendario-outline</title>
                <g fill="#333333">
                        <path d="M43.1,17.05 L43.1,10.24 C43.1,10.0522232 42.9477768,9.9 42.76,9.9 L34,9.9 L34,12.1 C34,12.6522847 33.5522847,13.1 33,13.1 C32.4477153,13.1 32,12.6522847 32,12.1 L32,9.9 L14,9.9 L14,12 C14,12.5522847 13.5522847,13 13,13 C12.4477153,13 12,12.5522847 12,12 L12,9.9 L5.24,9.9 C5.05222319,9.9 4.9,10.0522232 4.9,10.24 L4.9,17.05 L43.1,17.05 Z M43.1,18.95 L4.9,18.95 L4.9,40.76 C4.9,40.8501736 4.93582133,40.9366539 4.99958369,41.0004163 C5.06334606,41.0641787 5.14982639,41.1 5.24,41.1 L42.76,41.1 C42.8501736,41.1 42.9366539,41.0641787 43.0004163,41.0004163 C43.0641787,40.9366539 43.1,40.8501736 43.1,40.76 L43.1,18.95 Z M14,8 L32,8 L32,5.1 C32,4.54771525 32.4477153,4.1 33,4.1 C33.5522847,4.1 34,4.54771525 34,5.1 L34,8 L42.76,8 C43.9971178,8 45,9.00288216 45,10.24 L45,40.76 C45,41.9971178 43.9971178,43 42.76,43 L5.24,43 C4.00288216,43 3,41.9971178 3,40.76 L3,10.24 C3,9.00288216 4.00288216,8 5.24,8 L12,8 L12,5 C12,4.44771525 12.4477153,4 13,4 C13.5522847,4 14,4.44771525 14,5 L14,8 Z"/>
                </g>
                </svg>	
            )
        case 'cash':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={`${styles.orderListIcons}`}>
                <title>cash</title>
                <path d="M18.18 13.35c-0.42-0.475-1.030-0.775-1.709-0.78h-0.001c-0.78 0-1.17 0.31-1.17 1 0 1.48 4.21 1.41 4.21 4.45 0.002 0.041 0.003 0.088 0.003 0.136 0 1.46-1.082 2.667-2.488 2.862l-0.015 0.002v1.64h-1.56v-1.59c-1.085-0.129-2.046-0.58-2.805-1.255l0.005 0.005 1-1.56c0.594 0.554 1.383 0.905 2.253 0.94l0.007 0c0.86 0 1.33-0.39 1.33-1.090 0-1.64-4.21-1.64-4.21-4.53-0.003-0.050-0.005-0.108-0.005-0.166 0-1.424 1.038-2.606 2.398-2.831l0.017-0.002v-1.58h1.56v1.64c0.974 0.137 1.817 0.618 2.416 1.315l0.004 0.005z"></path>
                <path d="M16 27c-6.075 0-11-4.925-11-11s4.925-11 11-11c6.075 0 11 4.925 11 11v0c0 6.075-4.925 11-11 11v0zM16 7c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9v0c0-4.971-4.029-9-9-9v0z"></path>
                </svg>
            )
        case 'shipping':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <title>my-shippings</title>
                <path d="M16 5c0.038-0.005 0.081-0.008 0.125-0.008s0.087 0.003 0.13 0.009l-0.005-0.001 9.56 3.83c0.266 0.11 0.45 0.367 0.45 0.667 0 0.001 0 0.002 0 0.003v-0 12.96c-0.003 0.297-0.186 0.551-0.445 0.658l-0.005 0.002-9.54 3.88c-0.080 0.033-0.173 0.053-0.27 0.053s-0.19-0.019-0.275-0.054l0.005 0.002-9.56-3.88c-0.264-0.109-0.447-0.363-0.45-0.66v-12.92c0-0.001 0-0.002 0-0.003 0-0.3 0.184-0.558 0.445-0.666l0.005-0.002 9.56-3.87c0.041-0.006 0.087-0.009 0.135-0.009s0.094 0.003 0.14 0.010l-0.005-0.001zM16 6.49l-7.62 3 2.69 1.080 7.2-3.22zM20.38 8.24l-7.38 3.13 3 1.22 7.62-3.050zM24.85 10.6l-8.13 3.26v11.36l8.13-3.22zM7.15 10.6v11.4l8.13 3.26v-11.4l-3.11-1.25v3.39l-1.91-0.72v-3.43z"></path>
                </svg>
            )
        case 'arrowLeft':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <title>arrow-left-slim</title>
                    <path d="M18.94 24c-0 0-0.001 0-0.001 0-0.354 0-0.67-0.163-0.877-0.418l-0.002-0.002-6-7.34c-0.082-0.098-0.132-0.226-0.132-0.365s0.050-0.267 0.133-0.366l-0.001 0.001 6-7.11c0.211-0.247 0.522-0.402 0.87-0.402 0.631 0 1.142 0.511 1.142 1.142 0 0.283-0.103 0.542-0.273 0.742l0.001-0.002-4.8 5.65c-0.085 0.099-0.136 0.228-0.136 0.37s0.052 0.271 0.137 0.371l-0.001-0.001 4.81 5.86c0.162 0.195 0.261 0.449 0.261 0.726 0 0.356-0.163 0.674-0.419 0.883l-0.002 0.002c-0.192 0.162-0.441 0.26-0.714 0.26-0.006 0-0.011-0-0.017-0h0.001z"></path>
                </svg>
            )
        case 'shippingType':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={styles.orderDetailIcon}>
                <title>free-shipping</title>
                <path d="M24.17 11.070c-1.45-1.9-3.3-3.93-5.49-3.93h-12.12c-0.007-0-0.015-0-0.023-0-0.856 0-1.55 0.694-1.55 1.55 0 0.071 0.005 0.14 0.014 0.208l-0.001-0.008v3.66h9v-1.93h0.090l3 3v0.19l-3 3h-0.090v-1.91h-9v5c0 1.66 1.1 2 1.75 2h0.8c0.186 1.607 1.539 2.843 3.18 2.843s2.994-1.236 3.179-2.828l0.001-0.015h4.19c0.186 1.607 1.539 2.843 3.18 2.843s2.994-1.236 3.179-2.828l0.001-0.015h0.79c0 0 0.001 0 0.001 0 0.942 0 1.71-0.744 1.748-1.677l0-0.003v-3.090c0-2.12-2-5-2.83-6.060zM21.17 12.96v-3.47s0 0 0 0l0.27 0.26c0.557 0.527 1.068 1.089 1.535 1.687l0.025 0.033c0.078 0.087 0.153 0.181 0.223 0.28l0.007 0.010 0.080 0.11c0.041 0.041 0.077 0.087 0.108 0.137l0.002 0.003c0.357 0.455 0.71 0.968 1.032 1.501l0.038 0.069 0.090 0.16h-3c-0.096-0.007-0.181-0.052-0.24-0.12l-0-0c-0.116-0.161-0.186-0.363-0.186-0.581 0-0.038 0.002-0.076 0.006-0.114l-0 0.005zM10.73 22.87c-0.663 0-1.2-0.537-1.2-1.2s0.537-1.2 1.2-1.2v0c0.663 0 1.2 0.537 1.2 1.2s-0.537 1.2-1.2 1.2v0zM21.28 22.87c-0.663 0-1.2-0.537-1.2-1.2s0.537-1.2 1.2-1.2c0.663 0 1.2 0.537 1.2 1.2v0c0 0.663-0.537 1.2-1.2 1.2v0zM25.85 20.22c0 0.003 0 0.007 0 0.010 0 0.326-0.264 0.59-0.59 0.59-0.004 0-0.007-0-0.011-0h-0.889c-0.385-1.366-1.62-2.35-3.085-2.35s-2.7 0.984-3.080 2.327l-0.005 0.023h-4.37c-0.385-1.366-1.62-2.35-3.085-2.35s-2.7 0.984-3.080 2.327l-0.005 0.023h-0.9c-0.41 0-0.6-0.28-0.6-0.88v-3.89h6.68v0.78c-0 0.009-0 0.020-0 0.030 0 0.63 0.51 1.14 1.14 1.14 0.011 0 0.021-0 0.032-0l-0.002 0h0.090c0.006 0 0.012 0 0.019 0 0.311 0 0.592-0.13 0.791-0.34l0-0 3-3c0.208-0.204 0.34-0.486 0.35-0.798l0-0.002v-0.19c0-0.002 0-0.003 0-0.005 0-0.317-0.134-0.603-0.349-0.804l-0.001-0.001-3-3c-0.208-0.207-0.494-0.336-0.809-0.34h-0.091c-0.003-0-0.007-0-0.010-0-0.63 0-1.14 0.51-1.14 1.14 0 0.004 0 0.007 0 0.011v-0.001 0.78h-6.7v-2.56c0-0.55 0.21-0.6 0.41-0.6h12.1c0.712 0.047 1.356 0.307 1.877 0.716l-0.007-0.006v4c-0.003 0.037-0.004 0.079-0.004 0.122 0 0.405 0.141 0.778 0.377 1.071l-0.003-0.003c0.212 0.228 0.515 0.371 0.85 0.371 0.014 0 0.028-0 0.042-0.001l-0.002 0h3.21c0.447 0.759 0.747 1.656 0.838 2.614l0.002 0.026z"></path>
                </svg>
            )
        case 'addressPin':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={styles.orderDetailIcon}>
                <title>address-pin</title>
                <path d="M16 6.050c4.074 0.006 7.374 3.306 7.38 7.379v0.001c0 5.22-4.93 10.16-7.060 12.060-0.085 0.074-0.197 0.119-0.32 0.119s-0.235-0.045-0.321-0.119l0.001 0.001c-2.13-1.89-7.060-6.83-7.060-12.060 0.006-4.074 3.306-7.374 7.379-7.38h0.001zM16 5.050c-4.656 0-8.43 3.774-8.43 8.43v0c0 6.4 6.59 12.2 8.12 13.46 0.083 0.071 0.191 0.114 0.31 0.114s0.227-0.043 0.311-0.114l-0.001 0.001c1.53-1.26 8.12-7.060 8.12-13.46 0-0.015 0-0.032 0-0.050 0-4.656-3.774-8.43-8.43-8.43-0 0-0 0-0 0v0zM16 10.27c0.003 0 0.006-0 0.010-0 1.751 0 3.17 1.419 3.17 3.17s-1.419 3.17-3.17 3.17c-1.751 0-3.17-1.419-3.17-3.17 0-0.004 0-0.007 0-0.011v0.001c0.006-1.743 1.417-3.154 3.159-3.16h0.001zM16 9.27c-2.331 0-4.22 1.889-4.22 4.22s1.889 4.22 4.22 4.22c2.331 0 4.22-1.889 4.22-4.22 0-0.004 0-0.007 0-0.011v0.001c0-0.015 0-0.032 0-0.050 0-2.325-1.885-4.21-4.21-4.21-0.004 0-0.007 0-0.011 0h0.001z"></path>
                </svg>
            )
        case 'cashFull':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={styles.orderDetailIcon}>
                <title>cash</title>
                <path d="M18.18 13.35c-0.42-0.475-1.030-0.775-1.709-0.78h-0.001c-0.78 0-1.17 0.31-1.17 1 0 1.48 4.21 1.41 4.21 4.45 0.002 0.041 0.003 0.088 0.003 0.136 0 1.46-1.082 2.667-2.488 2.862l-0.015 0.002v1.64h-1.56v-1.59c-1.085-0.129-2.046-0.58-2.805-1.255l0.005 0.005 1-1.56c0.594 0.554 1.383 0.905 2.253 0.94l0.007 0c0.86 0 1.33-0.39 1.33-1.090 0-1.64-4.21-1.64-4.21-4.53-0.003-0.050-0.005-0.108-0.005-0.166 0-1.424 1.038-2.606 2.398-2.831l0.017-0.002v-1.58h1.56v1.64c0.974 0.137 1.817 0.618 2.416 1.315l0.004 0.005z"></path>
                <path d="M16 27c-6.075 0-11-4.925-11-11s4.925-11 11-11c6.075 0 11 4.925 11 11v0c0 6.075-4.925 11-11 11v0zM16 7c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9v0c0-4.971-4.029-9-9-9v0z"></path>
                </svg>
            )
      default:
        return (
          <></>
        )
    }
  }