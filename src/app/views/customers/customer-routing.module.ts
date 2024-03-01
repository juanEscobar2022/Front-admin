
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';

// import { UsersComponent } from './users/users.component';
// import { ListsComponent } from './lists/lists.component';
// import { StateComponent } from './state/state.component';
// import { CalendarComponent } from './calendar/calendar.component';
// import { ContactComponent } from './contact/contact.component';
import { CategoryComponent } from './category/category.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Clientes'
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'users'
      // },
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: 'Categorias'
        }
      },
      // {
      //   path: 'lists',
      //   component: ListsComponent,
      //   data: {
      //     title: 'Listas'
      //   }
      // },
      // {
      //   path: 'state',
      //   component: StateComponent,
      //   data: {
      //     title: 'Depertamentos'
      //   }
      // },

      // {
      //   path: 'calendar',
      //   component: CalendarComponent,
      //   data: {
      //     title: 'Festivos'
      //   }
      // },
      // {
      //   path: 'contact',
      //   component: ContactComponent,
      //   data: {
      //     title: 'Contact User'
      //   }
      // },
      // {
      //   path: 'module',
      //   component: ModuleComponent,
      //   data: {
      //     title: 'Módulo'
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }