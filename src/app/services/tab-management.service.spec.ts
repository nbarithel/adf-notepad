import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../testing/app-testing.module';
import { TabManagementService } from './tab-management.service';

describe('TabManagementService', () => {

    let service: TabManagementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          AppTestingModule,
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
      });

      service = new TabManagementService();

    });

    it('previousNote should be defined', () => {
      expect(service.previousNote.nodeId).toBeFalsy();
      expect(service.previousNote.contentValue).toBeFalsy();
      expect(service.previousNote.name).toBeFalsy();
      expect(service.previousNote.modifiedName).toBeFalsy();
      expect(service.previousNote).toBeDefined();
    });

    it('should emit commentsCount', async (() => {
      service.commentsCount$.subscribe((result: number) => {
        expect(result).toBe(5);
      });
      service.commentsCount$.next(5);
    }));

    it('should emit appendixCount', async (() => {
      service.appendixCount$.subscribe((result: number) => {
        expect(result).toBe(5);
      });
      service.appendixCount$.next(5);
    }));

    it('should emit versionsCount', async (() => {
      service.versionsCount$.subscribe((result: number) => {
        expect(result).toBe(5);
      });
      service.versionsCount$.next(5);
    }));

    it('should emit tabReady', async (() => {
      service.tabReady$.subscribe((result: boolean) => {
        expect(result).toBe(true);
      });
      service.tabReady$.next(true);
    }));


});
