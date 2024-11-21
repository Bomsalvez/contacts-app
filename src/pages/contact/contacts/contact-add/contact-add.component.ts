import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ContactService} from '../../../../shared/services/contact/contact.service';
import {NgForOf, NgIf} from '@angular/common';
import {TagMail, TagPhone} from '../../../../model/Contact';
import {NgxMaskDirective} from 'ngx-mask';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchCepService} from '../../../../shared/services/search-cep/search-cep.service';

@Component({
  selector: 'app-contact-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgxMaskDirective
  ],
  templateUrl: './contact-add.component.html',
  styleUrl: './contact-add.component.css'
})
export class ContactAddComponent implements OnInit {
  contactForm!: FormGroup;
  phoneForm!: FormGroup;
  mailForm!: FormGroup;
  addressForm!: FormGroup;
  phoneList: any[] = [];
  mailList: any[] = [];
  addressList: any[] = [];

  serverError: string | null = null;
  tagPhoneOptions = Object.values(TagPhone);
  tagMailOptions = Object.values(TagMail);
  private pkContact!: number;

  constructor(
    private readonly title: Title,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly contactService: ContactService,
    private readonly route: ActivatedRoute,
    protected readonly searchCepService: SearchCepService) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.pkContact = +params['id'];
        this.loadContact(this.pkContact);
      }
    });

    if (localStorage.getItem('token') === null) {
      this.router.navigate(['/login']); // Redirect to login page
    }
    this.title.setTitle('Add Contato');
    this.contactForm = this.formBuilder.group({
      nameContact: [null, [Validators.required]],
      dateBirthContact: [null,],
      nicknameContact: [null,],
      phoneNumbers: this.formBuilder.array([]),
      mails: this.formBuilder.array([]),
      addresses: this.formBuilder.array([])
    });
    this.phoneForm = this.createPhoneNumberGroup();
    this.mailForm = this.createMailGroup();
    this.addressForm = this.createAddressGroup();
  }

  createPhoneNumberGroup(): FormGroup {
    return this.formBuilder.group({
      pkPhoneNumber: [null],
      phoneNumber: [null, [Validators.required]],
      tagPhone: [TagPhone.PRINCIPAL, [Validators.required]]
    });
  }

  createMailGroup(): FormGroup {
    return this.formBuilder.group({
      pkMail: [null],
      mail: [null, [Validators.required]],
      tagMail: [TagMail.PRINCIPAL, [Validators.required]]
    });
  }

  createAddressGroup(): FormGroup {
    return this.formBuilder.group({
      pkAddress: [null],
      codeAddress: [null, [Validators.required]],
      streetAddress: [null, [Validators.required]],
      districtAddress: [null, [Validators.required]],
      cityAddress: [null, [Validators.required]],
      countryAddress: [null, [Validators.required]],
      isWorkAddress: [false]
    });
  }

  addPhoneNumber(): void {
    const phoneFormValue = {
      ...this.phoneForm.value,
      tagPhone: Object.keys(TagPhone).find(key => TagPhone[key as keyof typeof TagPhone] === this.phoneForm.value.tagPhone)
    };
    (this.contactForm.get('phoneNumbers') as FormArray).push(this.formBuilder.group(phoneFormValue));
    this.phoneList.push(phoneFormValue);
    this.phoneForm = this.createPhoneNumberGroup();
  }

  addMail(): void {
    const mailFormValue = {
      ...this.mailForm.value,
      tagMail: Object.keys(TagMail).find(key => TagMail[key as keyof typeof TagMail] === this.mailForm.value.tagMail)
    };
    (this.contactForm.get('mails') as FormArray).push(this.formBuilder.group(mailFormValue));
    this.mailList.push(mailFormValue);
    this.mailForm = this.createMailGroup();
  }

  addAddress(): void {
    (this.contactForm.get('addresses') as FormArray).push(this.addressForm);
    this.addressList.push(this.addressForm.value);
    this.addressForm = this.createAddressGroup();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      if (this.pkContact) {
        this.contactService.editContact(this.contactForm.value, this.pkContact).subscribe({
          next: () => {
            // Redirect to contact list
          },
          error: (err) => {
            console.error(err);
            if (err.error) {
              this.setFieldErrors(err.error);
            } else {
              this.serverError = err.error.message || 'An error occurred. Please try again.';
            }
          }
        });
      } else {
        this.contactService.addContact(this.contactForm.value).subscribe({
          next: () => {
            // Redirect to contact list
          },
          error: (err) => {
            console.error(err);
            if (err.error) {
              this.setFieldErrors(err.error);
            } else {
              this.serverError = err.error.message || 'An error occurred. Please try again.';
            }
          }
        });
      }
    } else {
      this.formValid(this.contactForm);
    }
  }

  private setFieldErrors(fieldErrors: any) {
    for (const field in fieldErrors) {
      if (this.contactForm.controls[field]) {
        this.contactForm.controls[field].setErrors({serverError: fieldErrors[field]});
      }
    }
  }

  private formValid(contactForm: FormGroup) {
    Object.keys(contactForm.controls).forEach(campo => {
      const control = contactForm.get(campo);
      control?.markAsTouched();
      control?.markAsDirty();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.formValid(this.contactForm);
      }
    });
  }

  fieldValid(field: string) {
    return this.contactForm.get(field)?.invalid && this.contactForm.get(field)?.touched;
  }

  getFieldError(field: string) {
    const control = this.contactForm.get(field);
    return control?.errors?.['serverError'] || null;
  }

  getArray(form: string) {
    return (<UntypedFormArray>this.contactForm.get(form)).controls;
  }

  editPhoneNumber(i: number) {
    this.phoneForm = this.formBuilder.group(this.phoneList[i]);
    (this.contactForm.get('phoneNumbers') as FormArray).removeAt(i);
    this.phoneList.splice(i, 1);
  }

  removePhoneNumber(i: number) {
    (this.contactForm.get('phoneNumbers') as FormArray).removeAt(i);
    this.phoneList.splice(i, 1);
  }

  editMail(i: number) {
    this.mailForm = this.formBuilder.group(this.mailList[i]);
    (this.contactForm.get('mails') as FormArray).removeAt(i);
    this.mailList.splice(i, 1);
  }

  removeMail(i: number) {
    (this.contactForm.get('mails') as FormArray).removeAt(i);
    this.mailList.splice(i, 1);
  }

  editAddress(i: number) {
    this.addressForm = this.formBuilder.group(this.addressList[i]);
    (this.contactForm.get('addresses') as FormArray).removeAt(i);
    this.addressList.splice(i, 1);
  }

  removeAddress(i: number) {
    (this.contactForm.get('addresses') as FormArray).removeAt(i);
    this.addressList.splice(i, 1);
  }

  getNumber(phoneNumber: string): string {
    if (phoneNumber.length === 11) {
      return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7, 11)}`;
    }
    return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6, 10)}`;
  }

  private loadContact(pkContact: number): void {
    this.contactService.findContact(pkContact).subscribe(contact => {
      this.contactForm.patchValue(contact);
      this.phoneList = contact.phoneNumbers;
      this.mailList = contact.mails;
      this.addressList = contact.addresses;
      this.updateFormArrays();
    });
  }

  private updateFormArrays(): void {
    this.contactForm.setControl('phoneNumbers', this.formBuilder.array(this.phoneList.map(phone => this.formBuilder.group(phone))));
    this.contactForm.setControl('mails', this.formBuilder.array(this.mailList.map(mail => this.formBuilder.group(mail))));
    this.contactForm.setControl('addresses', this.formBuilder.array(this.addressList.map(address => this.formBuilder.group(address))));
  }
}
