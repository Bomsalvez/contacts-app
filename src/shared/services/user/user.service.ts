import { Injectable } from '@angular/core';
import {environment} from '../../../settings/enviroments.enviroment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PromotionAuthorityUser, UserCreated, UserSummarize, UserToBeCreated} from '../../../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiURL = `${environment.apiUrl}/user`;


  constructor(private http: HttpClient) { }

  createUser(userToBeCreated: UserToBeCreated): Observable<UserCreated> {
    return this.http.post<UserCreated>(this.apiURL, userToBeCreated);
  }

  findUserByToken(): Observable<UserCreated> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserCreated>(this.apiURL, { headers });
  }

  findUser(pkUser: number): Observable<UserCreated> {
    return this.http.get<UserCreated>(`${this.apiURL}/${pkUser}`);
  }

findListUser(pageable: any, nameUser?: string, mailUser?: string): Observable<{ content: UserSummarize[] }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  let params: any = { ...pageable, sort: 'nameUser,asc' };
  if (nameUser) params.nameUser = nameUser;
  if (mailUser) params.mailUser = mailUser;
  return this.http.get<{ content: UserSummarize[] }>(`${this.apiURL}/list`, { headers, params });
}

  editUser(pkUser: number, userToBeCreated: UserToBeCreated): Observable<UserCreated> {
    return this.http.put<UserCreated>(`${this.apiURL}/${pkUser}`, userToBeCreated);
  }

  promotionUser(pkUser: number, promotionAuthorityUser: PromotionAuthorityUser): Observable<UserCreated> {
    return this.http.patch<UserCreated>(`${this.apiURL}/${pkUser}`, promotionAuthorityUser);
  }

  deleteUser(pkUser: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${pkUser}`);
  }
}
