export default function getIcon(icon) {
    switch (icon) {
      // some orders doesn't have a status yet and returns empty
      case '':
      case 'line':
          return (
            <svg width="506px" height="179px" viewBox="0 0 506 179" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient x1="0%" y1="45.4343266%" x2="2.11787711%" y2="48.8144764%" id="linearGradient-1">
                        <stop stop-color="#F24C3A" stop-opacity="0" offset="0%"></stop>
                        <stop stop-color="#E1251B" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <g id="Self-service-1.4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="AIRPLANE-DESKTOP" transform="translate(0.000000, -47.000000)">
                        <path d="M9,2.98427949e-13 C21.508421,19.9575658 21.508421,143.145 142.55586,110.53948 C263.603299,77.9339591 238.618924,152.795019 187.812568,177.5 C137.006212,202.204981 94.5987553,163.588493 167.342963,138.5 C240.08717,113.411507 365.605004,251.5 519,197.183" id="LINEPLANE" stroke="url(#linearGradient-1)" stroke-dasharray="5" transform="translate(264.000000, 104.976972) scale(-1, 1) translate(-264.000000, -104.976972) "></path>
                        <g id="PLANED" transform="translate(44.000000, 206.500000) scale(-1, 1) translate(-44.000000, -206.500000) translate(0.000000, 187.500000)">
                            <polyline id="Fill-98" fill="#89150F" points="17 29.2293769 25.0024546 38 86 12 17 29.2293769"></polyline>
                            <polyline id="Fill-99" fill="#E1251B" points="19.3233114 0 13.2486742 9.26509076 17.3558813 18.3448002 8.14201268 19.928896 0 38 88 11.0783275 19.3233114 0"></polyline>
                            <polyline id="Fill-100" fill="#89150F" points="17.1360454 18 13 9 61 11.2334385 17.1360454 18"></polyline>
                        </g>
                    </g>
                </g>
            </svg>
          )
      case 'plane':
          return (
            <svg width="309px" height="142px" viewBox="0 0 309 142" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient x1="0%" y1="45.4104002%" x2="2.11787711%" y2="48.8082636%" id="linearGradient-1">
                        <stop stop-color="#F24C3A" offset="0%"></stop>
                        <stop stop-color="#E1251B" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <g id="Self-service-1.4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="AIRPLANE" transform="translate(1.000000, 1.000000)">
                        <g id="PLANE" transform="translate(220.000000, 103.000000)">
                            <polyline id="Fill-98" fill="#89150F" points="17 29.2293769 25.0024546 38 86 12 17 29.2293769"></polyline>
                            <polygon id="Fill-99" fill="#E1251B" points="13.2486742 9.26509076 17.3558813 18.3448002 8.14201268 19.928896 0 38 88 11.0783275 19.3233114 0"></polygon>
                            <polyline id="Fill-100" fill="#89150F" points="17.1360454 18 13 9 61 11.2334385 17.1360454 18"></polyline>
                        </g>
                        <path d="M0,0 C7.3088421,11.6919956 7.3088421,83.8604633 78.0385221,64.7587549 C148.768202,45.6570464 134.169489,89.5138572 104.482638,103.987092 C74.7957867,118.460326 50.0165276,95.8371356 92.5219663,81.1392236 C135.027405,66.4413116 208.369199,147.339457 298,115.518235" id="LINEPLANE" stroke="url(#linearGradient-1)" stroke-dasharray="5"></path>
                    </g>
                </g>
            </svg>
          )
      default:
        return (
          <></>
        )
    }
  }