import React from "react";
import styled from "@emotion/styled";
import ClearIcon from "@mui/icons-material/Clear";
import { sizes } from "components/Text";

const Wrapper = styled.div`
  position: relative;
`;

const DeleteButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;

  &:hover {
    cursor: pointer;
  }
`;

const DeleteBadge = ({ onDelete, children }) => (
  <Wrapper>
    {
      onDelete ? (
        <DeleteButton onClick={onDelete} className="anim-pulse-on-hover">
          <ClearIcon fontSize={sizes.xs} />
        </DeleteButton>
      ) : null
    }
    {children}
  </Wrapper>
);

export default DeleteBadge;
