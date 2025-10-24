/**
 * Ajoute des charactéres après la valeur pour atteindre une longueur donnée
 * @param value Valeur à formater
 * @param length Longueur désirée
 * @param fill Caractère de remplissage (défaut: '0')
 */
export const padStart = (
  value: number | string,
  length: number,
  fill: number | string = '0'
): string => String(value).padStart(length, String(fill));

/**
 * Ajoute des charactéres après la valeur pour atteindre une longueur donnée
 * @param value Valeur à formater
 * @param length Longueur désirée
 * @param fill Caractère de remplissage (défaut: '0')
 */
export const padEnd = (
  value: number | string,
  length: number,
  fill: number | string = '0'
): string => String(value).padEnd(length, String(fill));
