import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Theme from '../../../../components/Theme/Theme'

import WalletContentsTable from '../../../../components/WalletContentsTable'

const { Cookies, WebCredentialHandler, credentialHandlerPolyfill } = window;

function loadWalletContents() {
  let walletContents = Cookies.get('walletContents');
  if (!walletContents) {
    walletContents = localStorage.getItem('walletContents');
  }
  if (!walletContents) {
    return null;
  }
  return JSON.parse(atob(walletContents));
}

const ChapiWalletGet = ({ tmui, setTmuiProp }) => {

  const [state, setState] = React.useState({})

  React.useEffect(() => {
    async function handleGetEvent() {
      const event = await WebCredentialHandler.receiveCredentialEvent();
      console.log('Wallet processing get() event:', event);

      // document.getElementById('requestOrigin').innerHTML = event.credentialRequestOrigin;

      const vp = event.credentialRequestOptions.web.VerifiablePresentation;
      const query = Array.isArray(vp.query) ? vp.query[0] : vp.query;

      if (!query.type === 'QueryByExample') {
        throw new Error('Only QueryByExample requests are supported in demo wallet.');
      }

      const walletContents = loadWalletContents();
      setState({
        ...state,
        walletLoaded: true
      })
      if (walletContents) {
        const walletRows = [];
        Object.values(walletContents).forEach((wc) => {
          if (wc.id) {
            walletRows.push(wc);
          } else {
            if (wc.verifiableCredential) {
              wc.verifiableCredential.forEach((vc) => {
                walletRows.push(vc);
              })
            }
          }
        })
        setState({
          ...state,
          event,
          walletRows
        })
      }

      // if (!walletContents) {
      //   return addToWalletDisplay({ text: 'none' });
      // }

      // for (const id in walletContents) {
      //   const vp = walletContents[id];
      //   const vc = Array.isArray(vp.verifiableCredential)
      //     ? vp.verifiableCredential[0]
      //     : vp.verifiableCredential;
      //   const types = vc.type;
      //   const type = types.slice(1).join('/');
      //   addToWalletDisplay({
      //     text: `${type} from ${vc.issuer}`,
      //     vc,
      //     button: {
      //       text: 'Share',
      //       sourceEvent: event
      //     }
      //   });
      // }
    }

    credentialHandlerPolyfill
      .loadOnce()
      .then(handleGetEvent);
  }, [state])


  return (
    <Theme>
      <div style={{ height: '100%', padding: '16px' }}>
        <Typography style={{ marginBottom: '16px', marginTop: '8px' }}>{window.origin} Is requesting a credential.</Typography>

        <WalletContentsTable walletRows={state.walletRows} onShare={(vc) => {
          const vp = {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              "https://www.w3.org/2018/credentials/examples/v1"
            ],
            "type": "VerifiablePresentation",
            "verifiableCredential": vc
          }
          state.event
            .respondWith(Promise.resolve({ dataType: 'VerifiablePresentation', data: vp }));
        }} />

      </div>
    </Theme>
  )
};

ChapiWalletGet.propTypes = {
  tmui: PropTypes.object,
  setTmuiProp: PropTypes.func
};

export default ChapiWalletGet;
