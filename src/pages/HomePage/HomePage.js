import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";

import BasePage from "../BasePage/BasePage";

import WalletContentList from '../../components/WalletContentList'

const HomePage = ({ tmui, setTmuiProp }) => (
  <BasePage tmui={tmui} setTmuiProp={setTmuiProp}>

    <WalletContentList/>

  </BasePage>
);

HomePage.propTypes = {
  tmui: PropTypes.object,
  setTmuiProp: PropTypes.func
};

export default HomePage;
