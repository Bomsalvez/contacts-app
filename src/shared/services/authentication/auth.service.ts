import { Injectable } from '@angular/core';
import {environment} from '../../../settings/enviroments.enviroment';
import {HttpClient} from '@angular/common/http';
import {Login, Token} from '../../../model/Login';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  loginUser(login: Login): Observable<Token> {
    return this.http.post<Token>(this.apiUrl, login);
  }
}
