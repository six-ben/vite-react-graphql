import React, { ReactChild } from 'react';
import styled from 'styled-components';

type CommonProps = {
  children?: ReactChild | ReactChild[] | JSX.Element[];
  className?: string;
  style?: React.CSSProperties;
};

const StyledBlockWrap = styled.div<{ padding: number; backgroundColor: string }>`
  padding: ${({ padding }) => `${padding}px`};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export function BlockWrap({
  children,
  style,
  className,
  padding = 24,
  backgroundColor = '#fff',
}: CommonProps & {
  padding?: number;
  backgroundColor?: string;
}) {
  return (
    <StyledBlockWrap padding={padding} backgroundColor={backgroundColor} className={className} style={style}>
      {children}
    </StyledBlockWrap>
  );
}

const StyledGridWrap = styled.div<{ minWidth: number; rowGap: number; columnGap: number }>`
  display: grid;
  grid-template-rows: max-content;
  grid-template-columns: repeat(auto-fill, minmax(${({ minWidth }) => minWidth}px, 1fr));
  grid-gap: ${({ rowGap }) => rowGap}px ${({ columnGap }) => columnGap}px;
`;

export function GridWrap({
  children,
  className,
  style,
  minWidth = 96,
  rowGap = 32,
  columnGap = 96,
}: CommonProps & { rowGap?: number; columnGap?: number; minWidth?: number }) {
  return (
    <StyledGridWrap rowGap={rowGap} columnGap={columnGap} minWidth={minWidth} className={className} style={style}>
      {children}
    </StyledGridWrap>
  );
}

const StyledFlexWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

export function FlexWrap({ children, className, style }: CommonProps) {
  return (
    <StyledFlexWrap className={className} style={style}>
      {children}
    </StyledFlexWrap>
  );
}
