import type { xdr } from 'stellar-sdk';
import { Operation, AuthRevocableFlag } from 'stellar-sdk';

export function prepareFreezeAssetTransaction(issuerPublicKey: string): xdr.Operation[] {
  return [
    Operation.setOptions({
      setFlags: AuthRevocableFlag,
      source: issuerPublicKey
    })
  ];
}
