import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Contact} from '../../../../model/Contact';
import {ContactService} from '../../../../shared/services/contact/contact.service';
import {DatePipe, NgForOf} from '@angular/common';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit {
  contact: Contact | undefined;
  private pkContact!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contactService: ContactService,
    private readonly router: Router,
    private readonly titleService: Title,
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Detalhes do contato');
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.pkContact = +params['id'];
        this.contactService.findContact(this.pkContact).subscribe(contact => {
          this.contact = contact;
        });
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  getNumber(phoneNumber: string): string {
    if (phoneNumber.length === 11) {
      return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7, 11)}`;
    }
    return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6, 10)}`;
  }

  getCep(codeAddress: string) {
    if (codeAddress.length === 8) {
      return `${codeAddress.substring(0, 5)}-${codeAddress.substring(5, 8)}`;
    }
    return codeAddress;
  }

  editContact() {
    this.router.navigate([`/contact/edit/${this.pkContact}`]);
  }
}
