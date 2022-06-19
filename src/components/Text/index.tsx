import React from "react";
import styled from "@emotion/styled";

const sizes = {
  xxl: "72px",
  xl: "64px",
  lg: "48px",
  md: "32px",
  mds: "24px",
  regular: "18px",
  sm: "14px",
  xs: "12px",
};

interface IStyledProps {
  fontStyle: string;
  size: "xs" | "sm" | "regular" | "mds"| "md" | "lg" | "xl" | "xxl";
  family: string;
  align?: string;
  decoration?: string;
  uppercase?: boolean,
  lowercase?: boolean,
  capitalize?: boolean
}

interface IProps {
  children: React.ReactNode
  id?: string;
  size?: "xs" | "sm" | "regular" | "mds"| "md" | "lg" | "xl" | "xxl";
  color?: string;
  style?: string;
  family?: string;
  align?: string;
  decoration?: string;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  component?: "div" | "span";
}

const getComponent = ({
  size,
  family,
  color,
  fontStyle,
  align,
  decoration,
  uppercase,
  lowercase,
  capitalize,
}) => `
  font-size: ${sizes[size]};
  font-family: 'Poppins-${family}';
  color: ${color};
  font-style: ${fontStyle};
  text-align: ${align};
  ${(decoration ? `text-decoration: ${decoration};` : "")}
  ${(uppercase ? `text-transform: ${uppercase};` : "")}
  ${(lowercase ? `text-transform: ${lowercase};` : "")}
  ${(capitalize ? `text-transform: ${capitalize};` : "")}
`;

const StyledTextDiv = styled.div<IStyledProps>`
  ${(props) => getComponent(props)}
`;

const StyledTextSpan = styled.span<IStyledProps>`
  ${(props) => getComponent(props)}
`;

const Text = ({
  children,
  id,
  size = "regular",
  family = "Regular",
  color = "#000",
  style = "regular",
  align = "left",
  decoration,
  uppercase,
  lowercase,
  capitalize,
  component = "div",
}: IProps) => {
  const Component = component === "div" ? StyledTextDiv : StyledTextSpan;

  return (
    <Component
      id={id}
      size={size}
      family={family}
      color={color}
      fontStyle={style}
      align={align}
      decoration={decoration}
      uppercase={uppercase}
      lowercase={lowercase}
      capitalize={capitalize}
    >
      {children}
    </Component>
  );
};

export default Text;
