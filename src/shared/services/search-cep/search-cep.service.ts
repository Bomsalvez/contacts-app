import { Injectable } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SearchCepService {

  constructor() { }

  findAddress(addressForm: FormGroup) {
    const cep = addressForm.get('codeAddress');
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
          addressForm.patchValue({
            streetAddress: address.logradouro,
            districtAddress: address.bairro,
            cityAddress: address.localidade,
            countryAddress: address.uf
          });
        })
        .catch(err => {
          addressForm.get('codeAddress')?.setErrors({serverError: 'CEP not found'});
        });
    }
  }
}
