export type UnitType = "pawn" | "bishop" | "rook";

export type BlackOrWhite = "white" | "black";

interface UnitAttributes {
  type: UnitType;
  colour: BlackOrWhite;
  count: number;
}

export class Unit implements UnitAttributes {
  type: UnitType;
  colour: BlackOrWhite;
  count: number;

  static Pawn(colour: BlackOrWhite, count: number): Unit {
    return new Unit({
      type: "pawn",
      colour,
      count,
    });
  }

  static Bishop(colour: BlackOrWhite): Unit {
    return new Unit({
      type: "bishop",
      colour,
      count: 1,
    });
  }

  static Rook(colour: BlackOrWhite): Unit {
    return new Unit({
      type: "rook",
      colour,
      count: 1,
    });
  }

  constructor(attributes: UnitAttributes) {
    this.type = attributes.type;
    this.colour = attributes.colour;
    this.count = attributes.count;
  }
}
