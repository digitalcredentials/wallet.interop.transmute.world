import React from "react";
import PropTypes from "prop-types";

import BasePage from "../BasePage/BasePage";

import WalletContentsTable from '../../components/WalletContentsTable'

const HomePage = ({ tmui, setTmuiProp }) => (
  <BasePage tmui={tmui} setTmuiProp={setTmuiProp}>
    <WalletContentsTable />
  </BasePage>
);

HomePage.propTypes = {
  tmui: PropTypes.object,
  setTmuiProp: PropTypes.func
};

export default HomePage;
