import {Component, OnInit} from '@angular/core';
import {Contact} from '../../../../model/Contact';
import {ContactService} from '../../../../shared/services/contact/contact.service';
import {Title} from '@angular/platform-browser';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts!: Contact[];
  filterForm!: FormGroup;

  constructor(
    private readonly contactService: ContactService,
    private readonly titleService: Title,) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Lista de Contatos');
    this.findMultipleContact();
  }

  protected findMultipleContact() {
    this.contactService.findMultipleContact().subscribe({
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

  }

  deleteContact(id: number) {
    console.log(id);
  }
}
