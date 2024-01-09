import type { xdr } from 'stellar-sdk';
import { Operation, AuthRevocableFlag, AuthClawbackEnabledFlag } from 'stellar-sdk';

export function prepareClawbackOperations(issuerPublicKey: string): xdr.Operation[] {
  return [
    Operation.setOptions({
      setFlags: AuthRevocableFlag,
      source: issuerPublicKey
    }),
    Operation.setOptions({
      setFlags: AuthClawbackEnabledFlag,
      source: issuerPublicKey
    })
  ];
}
