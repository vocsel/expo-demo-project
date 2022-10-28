import React, { useEffect, useState } from "react";
import Canvas from "components/Canvas";

import styled from "@emotion/styled";
import TopMenu from "components/TopMenu";
import { useItems, useVocselApi } from "store/store";
import { Vocsel } from "vocsel-api";
import InfoBox from "components/InfoBox";
import { File } from "vocsel-api/dist/objects/file";
import Freezer from "components/Freezer";
import Spinner from "components/Spinner";

const Wrapper = styled.div`
  position: relative;
`;

let vocselApi;

const App = () => {
  const [_, setItems] = useItems();
  const [__, setVocselApi] = useVocselApi();
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    async function init() {
      vocselApi = await Vocsel.auth({
        projectId: process.env.VOCSEL_PROJECT_ID as string,
        auth: process.env.NODE_ENV !== "production" ? {
          email: process.env.VOCSEL_LOGIN as string,
          password: process.env.VOCSEL_PASSWORD as string,
        } : null,
      });

      setVocselApi(vocselApi);

      const doc = await vocselApi.db.document("item");

      try {
        await doc.create();
      } catch (err) {
        console.error(err);
      }

      const items = await doc.findMany();

      setItems(items.map((item) => ({
        ...item,
        file: new File(item.file),
      })));

      setTimeout(() => {
        setShowPreloader(false);
      }, 1000);
    }

    init();
  }, []);

  return (
    <Wrapper>
      { vocselApi?.accessRights === "full_control" ? <TopMenu /> : null }
      <InfoBox />
      <Freezer message={<Spinner />} show={showPreloader}>
        <Canvas />
      </Freezer>
    </Wrapper>
  );
};

export default App;
