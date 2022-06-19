import React from "react";
import Canvas from "components/Canvas";

import styled from "@emotion/styled";
import TopMenu from "components/TopMenu";

const Wrapper = styled.div`
  position: relative;
`;

const App = () => (
  <Wrapper>
    <TopMenu />
    <Canvas />
  </Wrapper>
);

export default App;
