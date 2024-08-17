import React, {ReactNode} from 'react';
import _ from "underscore";

const constants = {
  cellSize: 50,
  pieceStrokeWidth: 0.8 * 50 /*cellSize*/,
  borderWidth: 5,
  pieceScaling: 0.1,
};

interface BaseUnitDefinitionProps {
  name: string,
  path: ReactNode,
  strokeWidth: number,
}

function BaseUnitDefinition(props: BaseUnitDefinitionProps) {
  const {name, path, strokeWidth} = props;
  return (
    <>
      <g id={`piece-${name}-base`}>{path}</g>
      <g id={`piece-${name}-white`}>
        <use xlinkHref={`#piece-${name}-base`} strokeWidth={strokeWidth} stroke={"#111"} />
        <use xlinkHref={`#piece-${name}-base`} fill={"white"} />
      </g>
      <g id={`piece-${name}-black`}>
        <use xlinkHref={`#piece-${name}-base`} strokeWidth={strokeWidth} stroke={"#bbb"} />
        <use xlinkHref={`#piece-${name}-base`} fill={"black"} />
      </g>
    </>
  );
}

export type BlackOrWhite = "white" | "black";

interface BaseUnitProps {
  name: string,
  colour: BlackOrWhite,
  scale?: number,
  offset?: {x: number, y: number},
}

function BaseUnit(props: BaseUnitProps) {
  const {name, colour, scale, offset} = props;
  return (
    <use
      xlinkHref={`#piece-${name}-${colour}`}
      transform={(scale || offset) ? [
        offset ? `translate(${offset.x} ${offset.y})` : "",
        scale ? `scale(${scale})` : "",
      ].join(" ") : undefined}
    />
  );
}
BaseUnit.rotateTransform = `rotate(180,${constants.cellSize / 2},${constants.cellSize / 2})`;

export interface UnitProps {
  colour: BlackOrWhite,
  scale?: number,
  offset?: {x: number, y: number},
}

export interface ManyProps {
  count: number,
}

const defineUnit = (name: string, props: Omit<BaseUnitDefinitionProps, "name">) => {
  const unitDefinition = (
    <BaseUnitDefinition
      key={name}
      {...props}
      name={name}
    />
  );

  function UnitFor(props: UnitProps) {
    return BaseUnit({name, ...props});
  }
  UnitFor.displayName = name;
  UnitFor.Definition = unitDefinition;
  function ManyUnitFor(props: UnitProps & ManyProps) {
    const {count, ...rest} = props;
    if (count <= 0){
      return null;
    }
    switch (count) {
      case 1:
        return <UnitFor {...rest} />;
      case 2:
        return <>
          <UnitFor {...rest} scale={0.75} offset={{x: -20, y: 0}} />
          <UnitFor {...rest} scale={0.75} offset={{x: 20, y: 0}} />
        </>;
      case 3:
        return <>
          <UnitFor {...rest} scale={0.5} offset={{x: -20, y: 0}} />
          <UnitFor {...rest} scale={0.5} offset={{x: 20, y: 0}} />
          <UnitFor {...rest} scale={0.5} offset={{x: 0, y: 10}} />
        </>;
      case 4:
        return <>
          <UnitFor {...rest} scale={0.4} offset={{x: -15, y: 0}} />
          <UnitFor {...rest} scale={0.4} offset={{x: 15, y: 0}} />
          <UnitFor {...rest} scale={0.4} offset={{x: 0, y: -15}} />
          <UnitFor {...rest} scale={0.4} offset={{x: 0, y: 15}} />
        </>;
      case 5:
        return <>
          <UnitFor {...rest} scale={0.3} offset={{x: 0, y: 0}} />
          <UnitFor {...rest} scale={0.3} offset={{x: -15, y: -15}} />
          <UnitFor {...rest} scale={0.3} offset={{x: 15, y: -15}} />
          <UnitFor {...rest} scale={0.3} offset={{x: 15, y: 15}} />
          <UnitFor {...rest} scale={0.3} offset={{x: -15, y: 15}} />
        </>;
    }
    return <>
      <UnitFor {...rest} scale={0.25} offset={{x: 0, y: 0}} />
      {_.range(count - 1).map(index => (
        <UnitFor
          {...rest}
          key={index}
          scale={0.25}
          offset={{
            x: Math.cos(index / (count - 1) * Math.PI * 2 - Math.PI / 2) * 20,
            y: Math.sin(index / (count - 1) * Math.PI * 2 - Math.PI / 2) * 20,
          }}
        />
      ))}
    </>;
  }
  ManyUnitFor.displayName = `Many${name}`;
  UnitFor.Many = ManyUnitFor;

  return UnitFor;
};

const UnitPawn = defineUnit('UnitPawn', {
  path: <path
    d={
      "M37,38c0-1.1,0.9-2,2-2h22c1.1,0,2,0.9,2,2s-0.9,2-2,2H39C37.9,40,37,39.1,37,38z M34,84h32"
      + "c1.1,0,2-0.9,2-2s-0.9-2-2-2H34c-1.1,0-2,0.9-2,2S32.9,84,34,84z M69,85H31c-2.2,0-4,1.8-4,4"
      + "s1.8,4,4,4h38c2.2,0,4-1.8,4-4S71.2,85,69,85z M50,35c7.18,0,13-5.82,13-13S57.18,9,50,9"
      + "s-13,5.82-13,13S42.82,35,50,35z M58,41H42c0,33.478-4.052,33.959-5.99,38H63.99"
      + "C62.052,74.959,58,74.478,58,41z"
    }
    transform={"scale(0.55) translate(-50 -50)"}
  />,
  strokeWidth: 10,
});

const UnitBishop = defineUnit("UnitBishop", {
  path: <path
    d={
      "M37,40c0-1.1,0.9-2,2-2h22c1.1,0,2,0.9,2,2s-0.9,2-2,2H39C37.9,42,37,41.1,37,40z M34,84"
      + "h32c1.1,0,2-0.9,2-2s-0.9-2-2-2H34c-1.1,0-2,0.9-2,2S32.9,84,34,84z M69,85H31c-2.2,0-4,1.8-4,4"
      + "s1.8,4,4,4h38c2.2,0,4-1.8,4-4S71.2,85,69,85z M40.95,43c-0.358,27.588-2.586,30.262-3.528,36"
      + "h25.156c-0.942-5.738-3.17-8.412-3.528-36H40.95z M59,37c0,0,4-6,4-11c0-4.411-10.112-13.488-12.496-19"
      + "h-1.008c-0.871,2.015-2.776,4.506-4.842,7.072l4.24,8.48l-1.789,0.895l-3.834-7.668"
      + "C40.1,19.686,37,23.558,37,26c0,5,4,11,4,11H59z"
    }
    transform={"scale(0.55) translate(-50 -50)"}
  />,
  strokeWidth: 10,
});

const UnitRook = defineUnit("UnitRook", {
  path: <path
    d={
      "M31,25V10h7v6h6v-6h12v6h6v-6h7v15c0,2.2-1.8,4-4,4H35C32.8,29,31,27.2,31,25z M65,34"
      + "c1.1,0,2-0.9,2-2s-0.9-2-2-2H35c-1.1,0-2,0.9-2,2s0.9,2,2,2H65z M30,84h40c1.1,0,2-0.9,2-2"
      + "s-0.9-2-2-2H30c-1.1,0-2,0.9-2,2S28.9,84,30,84z M73,85H27c-2.2,0-4,1.8-4,4s1.8,4,4,4h46"
      + "c2.2,0,4-1.8,4-4S75.2,85,73,85z M68.262,79C66.464,72.752,62,70.139,62,35H38"
      + "c0,35.139-4.464,37.752-6.262,44H68.262z"
    }
    transform={"scale(0.55) translate(-50 -50)"}
  />,
  strokeWidth: 10,
});

export const Unit = {
  Pawn: UnitPawn,
  Bishop: UnitBishop,
  Rook: UnitRook,
  Definitions: [
    UnitPawn.Definition,
    UnitBishop.Definition,
    UnitRook.Definition,
  ],
};
