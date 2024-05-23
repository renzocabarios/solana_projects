export function decode(uint: number[]) {
  const parsed = uint.filter((e) => {
    return e !== 0;
  });
  return String.fromCharCode(...new Uint8Array(parsed));
}

export function truncate(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function lamportsToSOL(amount: number) {
  return amount / 1_000_000_000;
}

export function SOLToLamports(amount: number) {
  return amount * 1_000_000_000;
}
