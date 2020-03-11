import HomePage from "./HomePage";
import KeystorePage from "./KeystorePage";
import ChapiWalletStore from "./chapi/wallet/store";
export const PAGES = [
  { path: "/", exact: true, component: HomePage },
  { path: "/chapi/wallet/store", exact: true, component: ChapiWalletStore },
  { path: "/keystore", exact: true, component: KeystorePage }
];
