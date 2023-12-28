// export class AuthDTO {
//   user_id: string;
//   access_token: string;
//   email: string;
//   password: string;

//   constructor(
//     user_id: string,
//     access_token: string,
//     email: string,
//     password: string
//   ) {
//     this.user_id = user_id;
//     this.access_token = access_token;
//     this.email = email;
//     this.password = password;
//   }
// }

export class AuthDTO {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  }= {
    id: 0,
    name: '',
    email: '',
    email_verified_at: null,
    created_at: '',
    updated_at: '',
  };
  token: string = '';

  constructor(data:any = {})
  {
    this.user = {
      id: data.user?.id ||0,
      name: data.user?.name || '',
      email: data.user?.email || '',
      email_verified_at: data.user?.email_verified_at || '',
      created_at: data.user?.created_at || '',
      updated_at: data.user?.updated_at || ''
    };
    this.token = data.token || '';
  }
  static authDTOFromJson(json: any): AuthDTO {
    return new AuthDTO(json);
  }
}
