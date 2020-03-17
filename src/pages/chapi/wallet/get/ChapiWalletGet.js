import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Theme from '../../../../components/Theme/Theme'

import WalletContentsTable from '../../../../components/WalletContentsTable'

const { WebCredentialHandler, credentialHandlerPolyfill } = window;

const ChapiWalletGet = (props) => {
  const [state, setState] = React.useState({
    event: {}
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
      if (!query.type === 'QueryByExample') {
        throw new Error('Only QueryByExample requests are supported in demo wallet.');
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

        <WalletContentsTable walletRows={props.walletObjectToArray(props.chapi.wallet.object)} onShare={(vc) => {
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
