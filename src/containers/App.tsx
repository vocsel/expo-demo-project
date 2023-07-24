import React, { useEffect } from "react";

import styled from "@emotion/styled";
import { useItems, useVocselApi } from "store/store";
import { Vocsel } from "vocsel-api";
import { File } from "vocsel-api/dist/objects/file";
import * as qs from "qs";
import Aside from "components/Aside";
import Dashboard from "components/Dashboard";

const Wrapper = styled.div`
  position: relative;
`;

let vocselApi;

const App = () => {
  const [_, setItems] = useItems();
  const [__, setVocselApi] = useVocselApi();
  const { location } = window;

  useEffect(() => {
    async function init() {
      let { projectId, token, publicKey } = qs.parse(location.search.replace(/^\?/, ""));

      if (!projectId) projectId = process.env.PROJECT_ID;
      if (!token) token = process.env.TOKEN;
      if (!publicKey) publicKey = process.env.PUBLIC_KEY;

      vocselApi = (await Vocsel.auth({
        projectId,
        auth: token ? { token } : null,
      })).public;

      setVocselApi(vocselApi);

      const doc = await vocselApi.db.document("item");

      try {
        await doc.create();
      } catch (err) {
        console.error(err);
      }

      const items = await doc.findMany();

      setItems(
        items.map((item) => ({
          ...item,
          file: new File(item.file),
        })),
      );
    }

    init();
  }, []);

  return (
    <Wrapper>
      {/* <Aside /> */}
      <Dashboard />
    </Wrapper>
  );
};

export default App;
