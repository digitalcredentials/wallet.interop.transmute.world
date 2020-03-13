import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import Theme from '../../../../components/Theme/Theme'
import Loading from '../../../../components/Loading/Loading'

import CredentialCard from '../../../../components/CredentialCard/CredentialCard'

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

function storeInWallet(verifiablePresentation) {
  const walletContents = loadWalletContents() || {};
  const vc = Array.isArray(verifiablePresentation.verifiableCredential)
    ? verifiablePresentation.verifiableCredential[0]
    : verifiablePresentation.verifiableCredential;
  const id = vc.id;
  walletContents[id] = verifiablePresentation;

  // base64 encode the serialized contents (verifiable presentations)
  const serialized = btoa(JSON.stringify(walletContents));
  Cookies.set('walletContents', serialized, { path: '', secure: true, sameSite: 'None' });
  // console.log('here...', walletContents)
  localStorage.setItem('walletContents', serialized);
}


const ChapiWalletStore = ({ tmui, setTmuiProp }) => {

  const [state, setState] = React.useState({})

  React.useEffect(() => {
    const handleStoreEvent = async () => {
      const event = await WebCredentialHandler.receiveCredentialEvent();
      console.log('Store Credential Event:', event.type, event);
      const credential = event.credential;
      // Display the credential details, for confirmation
      const vp = credential.data;
      const vc = Array.isArray(vp.verifiableCredential)
        ? vp.verifiableCredential[0]
        : vp.verifiableCredential;


      setState({
        ...state,
        event,
        credential,
        vc
      })
    }

    credentialHandlerPolyfill
      .loadOnce()
      .then(handleStoreEvent);
  }, [])

  if (!state.credential) {
    return <Loading message={'Loading credential...'} />
  }
  return (
    <Theme>
      <div style={{ height: '100%', padding: '16px' }}>
        <Typography style={{ marginBottom: '16px', marginTop: '8px' }}>Are you sure you wish to store this credential?</Typography>

        <CredentialCard vc={state.vc} />

        <Button style={{ position: 'absolute', bottom: '10px', left: '10px' }} onClick={() => {
          state.event.respondWith(new Promise(resolve => {
            return resolve({ dataType: 'Response', data: 'canceled' });
          }))
        }}>Cancel</Button>

        <Button variant={'contained'} color={'primary'} style={{ position: 'absolute', bottom: '10px', right: '10px' }} onClick={() => {
          storeInWallet(state.credential.data);
          state.event.respondWith(new Promise(resolve => {
            return resolve({ dataType: 'Response', data: 'result' });
          }))
        }}>Confirm</Button>
      </div>
    </Theme>
  )
};

ChapiWalletStore.propTypes = {
  tmui: PropTypes.object,
  setTmuiProp: PropTypes.func
};

export default ChapiWalletStore;
