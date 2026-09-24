import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {ReservaComponent} from './pages/reserva/reserva.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ComplejoComponent} from './pages/complejo/complejo.component';
import {AuthGuardGuard} from './shared/auth-guard.guard';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ErrorServerComponent} from './error/error-server/error-server.component';
import {NotFoundComponent} from './error/not-found/not-found.component';
import {JugadorComponent} from './pages/jugador/jugador.component';

const routes: Routes = [
  {
    path: '' , redirectTo: 'app-root', pathMatch: 'full'
  },
  {
    path: 'main-layout', component: MainLayoutComponent, canActivate: [AuthGuardGuard], children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'reservas', component: ReservaComponent
      },
      {
        path: 'complejos', component: ComplejoComponent
      },
      {
        path: 'modificar-datos', component: JugadorComponent
      },
      {
        path: 'error-server', component: ErrorServerComponent
      },
      {
        path: 'not-found', component: NotFoundComponent
      }
    ]
  },
  { path: '**', redirectTo:'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
