export interface Permission {
  pkPermission: number;
  namePermission: string;
}

export interface User {
  pkUser: number;
  nameUser: string;
  mailUser: string;
  passwordUser: string;
  permissions: Permission[];
}

export interface UserToBeCreated {
  nameUser: string;
  mailUser: string;
  passwordUser: string;
  permissions: Permission[];
}

export interface UserCreated {
  pkUser: number;
  nameUser: string;
  mailUser: string;
  permissions: Permission[];
}

export interface PromotionAuthorityUser {
  pkPermission: number;
}

export interface UserSummarize {
  pkUser: number;
  nameUser: string;
  mailUser: string;
}
