import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StatusToDoService } from '../service/status-to-do.service';

import { StatusToDoComponent } from './status-to-do.component';

describe('Component Tests', () => {
  describe('StatusToDo Management Component', () => {
    let comp: StatusToDoComponent;
    let fixture: ComponentFixture<StatusToDoComponent>;
    let service: StatusToDoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StatusToDoComponent],
      })
        .overrideTemplate(StatusToDoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StatusToDoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StatusToDoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.statuses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
