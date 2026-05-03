import { isStringValid } from '../check/isString';
import { pInt, pFloat } from '../cast/toNumber';
import { toBoolean } from '../cast/toBoolean';
import { glb } from '../glb';
import { jsonParse } from '../string/json';

export const processEnv = () => (
  glb.process.env || {}
);

export const envString = (key: string, defaultValue?: string) => {
  const value = processEnv()[key];
  if (isStringValid(value)) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error('no env ' + key);
};

export const envInt = (key: string, defaultValue?: number) => {
  const value = pInt(envString(key, ''));
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error('env not int ' + key);
};

export const envFloat = (key: string, defaultValue?: number) => {
  const value = pFloat(envString(key, ''));
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error('env not float ' + key);
};

export const envBoolean = (key: string, defaultValue?: boolean) => {
  const value = toBoolean(envString(key, ''), defaultValue);
  if (value !== undefined) return value;
  throw new Error('env not boolean ' + key);
};

export const envJson = <T = any>(key: string, defaultValue?: T): T => {
  const value = jsonParse(envString(key, '')) as T;
  if (value !== undefined && value !== null) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error('env not json ' + key);
};