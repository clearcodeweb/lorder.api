declare namespace jest {
  interface Expect {
    toBeWithinRange(fromNumber: number, toNumber: number): (fromNumber: number, toNumber: number) => boolean;
  }
}
