export interface CommonInput {
  textChanged(callback: any): void;
  valueChanged(callback: any): void;
  isValidChanged(callback: any): void;
  
  destroy(): void;
}

export interface CallbackObject {
  type: string;
  callback(changedValue: string | boolean | number | null | undefined): void;
}