import { withHandlers } from "recompose";
import { compose } from 'recompose';

const walletObjectToArray = (walletContents = {}) => {
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
        setChapiProp({ wallet: { isLoaded: true, object: walletContents } });
      }
    },
  }),
  withHandlers({
    storeInWallet: ({ chapi, loadWalletContents }) => (verifiablePresentation) => {
      let walletContents = chapi.wallet.object || {};
      const vc = Array.isArray(verifiablePresentation.verifiableCredential)
        ? verifiablePresentation.verifiableCredential[0]
        : verifiablePresentation.verifiableCredential;
      const id = vc.id;
      walletContents[id] = verifiablePresentation;
      // base64 encode the serialized contents (verifiable presentations)
      const serialized = btoa(JSON.stringify(walletContents));
      localStorage.setItem('walletContents', serialized);
      loadWalletContents();
    }
  }))

