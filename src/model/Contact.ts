export interface Contact {
  pkContact: number;
  nameContact: string;
  dateBirthContact: string;
  nicknameContact: string;
  phoneNumbers: PhoneNumber[];
  mails: Mail[];
  addresses: Address[];
}

export interface PhoneNumber {
  pkPhoneNumber: number;
  phoneNumber: string;
  tagPhone: TagPhone;
}


export enum TagPhone {
  CELULAR = 'Celular',
  COMERCIAL = 'Comercial',
  CASA = 'Casa',
  PRINCIPAL = 'Principal',
  OUTROS = 'Outros'
}

export interface Mail {
  pkMail: number;
  mail: string;
  tagMail: TagMail;
}

export enum TagMail {
  COMERCIAL = 'Comercial',
  CASA = 'Casa',
  PRINCIPAL = 'Principal',
  OUTROS = 'Outros'
}

export interface Address {
  pkAddress: number;
  codeAddress: string;
  streetAddress: string;
  districtAddress: string;
  cityAddress: string;
  countryAddress: string;
  isWorkAddress: boolean;
}
