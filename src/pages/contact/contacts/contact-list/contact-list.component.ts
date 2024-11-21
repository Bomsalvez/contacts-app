import {Component, OnInit} from '@angular/core';
import {Contact} from '../../../../model/Contact';
import {ContactService} from '../../../../shared/services/contact/contact.service';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts!: Contact[];
  filterForm!: FormGroup;

  constructor(
    private readonly contactService: ContactService,
    private readonly titleService: Title,
    private readonly fb: FormBuilder,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Lista de Contatos');
    this.filterForm = this.fb.group({
      nameContact: [null],
      pagination: this.fb.group({
        page: [0],
        size: [10],
        sort: ['nameContact,asc']
      })
    });
    this.findMultipleContact();
  }

  protected findMultipleContact() {
    const token = localStorage.getItem('token');
    const nameContact = this.filterForm.get('nameContact')?.value;
    const pagination = this.filterForm.get('pagination')?.value;

    this.contactService.findMultipleContact(nameContact, token, pagination).subscribe({
      next: (contacts) => {
        console.log(contacts);
        this.contacts = contacts.content;
      },
      error: (err) => {
        console.error(err.error.error);
      }
    });
  }

  editContact(id: number) {
    console.log(id);
   this.router.navigate([`/contact/edit/${id}`]);

  }

  deleteContact(id: number) {
    console.log(id);
    this.contactService.deleteContact(id).subscribe({
      next: (response) => {
        console.log(response);
        this.findMultipleContact();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  checkToken() {
    return (localStorage.getItem('token') !== null);
  }

  viewContact(pkContact: number) {

  }
}
