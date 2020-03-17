import { withHandlers } from "recompose";
import { compose } from 'recompose';

import { v4 as uuidv4 } from 'uuid';

const walletObjectToArray = (walletContents = {}) => {
  let walletRows = [];
  let keys = Object.keys(walletContents);
  Object.values(walletContents).forEach((v1) => {
    if (v1.id) {
      walletRows.push(v1);
    } else {
      // v1.id = key;
      if (v1.verifiableCredential) {
        v1.verifiableCredential.forEach((v2) => {
          // v2.id = k2;
          walletRows.push(v2);
        })
      } else {
        walletRows.push(v1);
      }
    }
  })

  walletRows = walletRows.map((v, i) => {
    if (!v.id) {
      v.id = keys[i]
      v.type = ['VerifiablePresentation', 'DIDAuth']
    }
    return v;
  })
  console.log(walletRows);
  return walletRows;
}

export default compose(
  withHandlers({
    walletObjectToArray: () => walletObjectToArray,
    loadWalletContents: ({ setChapiProp }) => () => {
      let walletContents = localStorage.getItem('walletContents');
      if (!walletContents) {
        setChapiProp({
          wallet: {
            isLoaded: true
          }
        });
      } else {
        walletContents = JSON.parse(atob(walletContents));

        console.log(walletContents)
        setChapiProp({ wallet: { isLoaded: true, object: walletContents } });
      }
    },
  }),
  withHandlers({
    storeInWallet: ({ chapi, loadWalletContents }) => (verifiablePresentation) => {

      console.log(verifiablePresentation);

      let walletContents = chapi.wallet.object || {};
      let vc = verifiablePresentation;
      if (verifiablePresentation.verifiableCredential) {
        vc = Array.isArray(verifiablePresentation.verifiableCredential)
          ? verifiablePresentation.verifiableCredential[0]
          : verifiablePresentation.verifiableCredential;
      }
      const id = vc.id || `urn:uuid:${uuidv4()}`;

      walletContents[id] = vc;

      console.log(walletContents);
      // base64 encode the serialized contents (verifiable presentations)
      const serialized = btoa(JSON.stringify(walletContents));
      localStorage.setItem('walletContents', serialized);
      loadWalletContents();
    }
  }))

