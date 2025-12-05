import { Vector, Vector1, Vector2, Vector3, Vector4, Vector5 } from 'fluxio/types/Vector';
import { isArrayOfNumber } from './isArrayOf';

export const isVector = (v: any): v is Vector => isArrayOfNumber(v);
export const isVector1 = (v: any): v is Vector1 => isVector(v) && v.length === 1;
export const isVector2 = (v: any): v is Vector2 => isVector(v) && v.length === 2;
export const isVector3 = (v: any): v is Vector3 => isVector(v) && v.length === 3;
export const isVector4 = (v: any): v is Vector4 => isVector(v) && v.length === 4;
export const isVector5 = (v: any): v is Vector5 => isVector(v) && v.length === 5;
