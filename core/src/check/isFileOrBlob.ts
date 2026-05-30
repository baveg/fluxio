export const isFile = (v: any): v is File => v instanceof File;

export const isBlob = (v: any): v is Blob => v instanceof Blob;

export const isFileOrBlob = (v: any): v is File | Blob => isFile(v) || isBlob(v);
