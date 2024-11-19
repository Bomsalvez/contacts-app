import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../settings/enviroments.enviroment';
import {Contact} from '../../../model/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  constructor(private readonly http: HttpClient) {}

  addContact(contactsDto: Contact): Observable<Contact> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Contact>(this.apiUrl, contactsDto, { headers });
  }

  findContact(pkContact: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${pkContact}`);
  }

  findMultipleContact(nameContact?: string, token?: string, page: number = 0, size: number = 10, sort: string = 'nameContact,asc'): Observable<{ content:Contact[]}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (nameContact) {
      params = params.set('nameContact', nameContact);
    }

    const headers = token ? new HttpHeaders().set('Authorization', token) : undefined;

    return this.http.get<{ content:Contact[]}>(this.apiUrl, { params, headers });
  }

  editContact(contactsDto: Contact, pkContact: number): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${pkContact}`, contactsDto);
  }

  deleteContact(pkContact: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pkContact}`);
  }
}
