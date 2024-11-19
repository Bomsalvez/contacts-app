import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ContactService} from '../../../../shared/services/contact/contact.service';
import {NgForOf, NgIf} from '@angular/common';
import {TagMail, TagPhone} from '../../../../model/Contact';
import {NgxMaskDirective} from 'ngx-mask';

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

  constructor(
    private readonly title: Title,
    private readonly formBuilder: FormBuilder,
    private readonly contactService: ContactService) {
  }

  ngOnInit(): void {
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
      phoneNumber: [null, [Validators.required]],
      tagPhone: [TagPhone.PRINCIPAL, [Validators.required]]
    });
  }

  createMailGroup(): FormGroup {
    return this.formBuilder.group({
      mail: [null, [Validators.required]],
      tagMail: [TagMail.PRINCIPAL, [Validators.required]]
    });
  }

  createAddressGroup(): FormGroup {
    return this.formBuilder.group({
      codeAddress: [null, [Validators.required]],
      streetAddress: [null, [Validators.required]],
      districtAddress: [null, [Validators.required]],
      cityAddress: [null, [Validators.required]],
      countryAddress: [null, [Validators.required]],
      isWorkAddress: [null]
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
    console.log(this.contactForm.value);
    if (this.contactForm.valid) {
      this.contactService.addContact(this.contactForm.value).subscribe({
        next: () => {
          // Redirect to contact list
        },
        error: (err) => {
          if (err.error && err.error.fieldErrors) {
            this.setFieldErrors(err.error.fieldErrors);
          } else if (err.error && err.error.error) {
            this.serverError = err.error.error;
          } else {
            this.serverError = err.error.message || 'An error occurred. Please try again.';
          }
        }
      });
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

  findAddress() {
    const cep = this.addressForm.get('codeAddress');
    if (cep?.value) {
      const url = `https://viacep.com.br/ws/${cep.value}/json/`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('CEP not found');
          }
          return response.json();
        })
        .then(address => {
          this.addressForm.patchValue({
            streetAddress: address.logradouro,
            districtAddress: address.bairro,
            cityAddress: address.localidade,
            countryAddress: address.uf
          });
        })
        .catch(err => {
          this.addressForm.get('codeAddress')?.setErrors({serverError: 'CEP not found'});
        });
    }
  }

  getNumber(phoneNumber: string): string {
    if (phoneNumber.length === 11) {
      return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7, 11)}`;
    }
    return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6, 10)}`;
  }
}
