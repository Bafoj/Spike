import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Deberia poder mostrar los dispositivos no asignados sin cambios', async () => {
    // Given -- tenemos uno de los dispositivos por defecto a asignado en una habitación
  
    // When -- listamos todos los dispositivos no asignados
    const listDevices:string[] = await service.listenChanges().pipe(take(1)).toPromise();

    // Then -- no debería de estar el dispositivo asignado a la habitación
    expect(listDevices.length).toBeGreaterThan(0);

  },15000);
});
