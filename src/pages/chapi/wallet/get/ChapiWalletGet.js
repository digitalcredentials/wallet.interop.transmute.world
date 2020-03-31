import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Theme from '../../../../components/Theme/Theme'

import WalletContentsTable from '../../../../components/WalletContentsTable'

const { WebCredentialHandler, credentialHandlerPolyfill } = window;

const ChapiWalletGet = (props) => {
  const [state, setState] = React.useState({
    event: {},
  })
  React.useEffect(() => {
    credentialHandlerPolyfill
      .loadOnce()
      .then(() => {
        if (!props.chapi.wallet.isLoaded) {
          props.loadWalletContents();
        }
      })
  }, [])

  React.useEffect(() => {
    async function handleGetEvent() {
      const event = await WebCredentialHandler.receiveCredentialEvent();
      console.log('Wallet processing get() event:', event);
      const vp = event.credentialRequestOptions.web.VerifiablePresentation;
      const query = Array.isArray(vp.query) ? vp.query[0] : vp.query;

      if (query.type === 'DIDAuth') {
        // TODO: Sign Presentation...
        const endpoint = 'https://vc.transmute.world/vc-data-model/presentations'

        const response = await fetch(endpoint, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({
            presentation: {
              "@context": "https://www.w3.org/2018/credentials/v1",
              "type": "VerifiablePresentation",
              "holder": "did:web:vc.transmute.world",
            }, options: {
              proofPurpose: "authentication",
              domain: event.credentialRequestOrigin.split('//').pop(),
              challenge: event.credentialRequestOptions.web.VerifiablePresentation.query.challenge,
              verificationMethod: "did:web:vc.transmute.world#z6MksHh7qHWvybLg5QTPPdG2DgEjjduBDArV9EF9mRiRzMBN"
            }
          })
        });

        let signedDIDAuthResponse = await response.json();
        props.storeInWallet(signedDIDAuthResponse);

      }


      setState({
        ...state,
        event,
      })
    }
    credentialHandlerPolyfill
      .loadOnce()
      .then(handleGetEvent);
  }, [])

  return (
    <Theme>
      <div style={{ height: '100%', padding: '8px' }}>
        <Typography style={{ marginBottom: '8px', marginTop: '4px' }}>{state.event.credentialRequestOrigin} Is requesting a credential.</Typography>

        <WalletContentsTable credentialRequestOptions={state.event.credentialRequestOptions} walletRows={props.walletObjectToArray(props.chapi.wallet.object)} onShare={async (thing) => {
          let vp = thing;
          if (thing.type !== 'VerifiablePresentation') {
            vp = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1"
              ],
              "type": "VerifiablePresentation",
              "verifiableCredential": thing
            }
          }
          // TODO: Sign Presentation...
          const endpoint = 'https://vc.transmute.world/vc-data-model/presentations'

          const response = await fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
              presentation: vp, options: {
                proofPurpose: "assertionMethod",
                verificationMethod: "did:web:vc.transmute.world#z6MksHh7qHWvybLg5QTPPdG2DgEjjduBDArV9EF9mRiRzMBN"
              }
            })
          });

          let signedVp = await response.json();

          state.event
            .respondWith(Promise.resolve({
              dataType: 'VerifiablePresentation', data: signedVp
            }));
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
