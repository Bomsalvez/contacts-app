import {Routes} from '@angular/router';
import {HomeComponent} from '../pages/contact/home/home.component';
import {UserDetailComponent} from '../pages/contact/usuario/user-detail/user-detail.component';
import {LoginComponent} from '../pages/contact/usuario/login/login.component';
import {CreateUserComponent} from '../pages/contact/usuario/create-user/create-user.component';
import {ContactAddComponent} from '../pages/contact/contacts/contact-add/contact-add.component';
import {ContactListComponent} from '../pages/contact/contacts/contact-list/contact-list.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'user',
    children: [
      {path: '', component: UserDetailComponent},
      {path: 'create', component: CreateUserComponent},
    ]
  },
  {
    path: 'contact', children: [
      {path: 'add', component: ContactAddComponent},
      {path: 'edit/:id', component: ContactAddComponent},
      {path: 'list', component: ContactListComponent},
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''} // Redireciona para a home em caso de 404 fora da rota 'usuario'
];
