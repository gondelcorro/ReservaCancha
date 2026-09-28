import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {ReservaComponent} from './pages/reserva/reserva.component';
import {SchedulerModule} from 'angular-calendar-scheduler';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {SchedulerComponent} from './pages/dashboard/scheduler/scheduler.component';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {DatePipe, registerLocaleData} from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import {CrearReservaComponent} from './pages/dashboard/scheduler/crear-reserva/crear-reserva.component';
import {EditarReservaComponent} from './pages/reserva/editar-reserva/editar-reserva.component';
import {ErrorServerComponent} from './error/error-server/error-server.component';
import {NotFoundComponent} from './error/not-found/not-found.component';
import {TokenInterceptor} from './shared/token.interceptor';
import {DetalleReservaComponent} from './pages/reserva/detalle-reserva/detalle-reserva.component';
import {ComplejoComponent} from './pages/complejo/complejo.component';
import {CanchaComponent} from './pages/complejo/cancha/cancha.component';
import {JugadorComponent} from './pages/jugador/jugador.component';
import {ProcesandoReservaComponent} from './pages/dashboard/procesando-reserva/procesando-reserva.component';
import {CierreTemporalComponent} from './pages/dashboard/cierre-temporal/cierre-temporal.component';
import {AnulacionComponent} from './pages/reserva/anulacion/anulacion.component';
import {AbonarFechaComponent} from './pages/reserva/abonar-fecha/abonar-fecha.component';
import {AvatarModule} from 'ngx-avatars';
import {LottieComponent, provideLottieOptions} from 'ngx-lottie';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    ReservaComponent,
    ComplejoComponent,
    DashboardComponent,
    SchedulerComponent,
    CrearReservaComponent,
    EditarReservaComponent,
    ErrorServerComponent,
    NotFoundComponent,
    DetalleReservaComponent,
    CanchaComponent,
    JugadorComponent,
    ProcesandoReservaComponent,
    CierreTemporalComponent,
    AnulacionComponent,
    AbonarFechaComponent
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    //CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }), // ng add angular-calendar
    SchedulerModule.forRoot({locale: 'es', headerDateFormat: 'daysRange'}), //npm install angular-calendar-scheduler date-fns --save
    NgxMatTimepickerModule, //npm i ngx-mat-timepicker (Este es el q estoy usando)
    NgxMaterialTimepickerModule, // npm install --save ngx-material-timepicker
    AvatarModule,
    LottieComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-AR'
    },
    DatePipe,
    provideHttpClient(withInterceptorsFromDi()),
    provideLottieOptions({
      player: () => import('lottie-web')
    })
  ]
})
export class AppModule {
}
