export enum ModalType {
  NONE,
  QR_CODE,
  DELETE
}
export interface Modal {
  open: boolean,
  type: ModalType,
  info: string | ModalInfo
}

export interface ModalInfo {
  short_code: string,
  delete_token: string
}