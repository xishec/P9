import { TestBed, getTestBed } from '@angular/core/testing';

import { ToolSelectorService } from './tool-selector.service';
import { ToolName } from 'src/constants/tool-constants';

fdescribe('ToolSelectorService', () => {
    let injector: TestBed;
    let service: ToolSelectorService;

    let spyOnChangeCurrentToolName: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToolSelectorService]
        });

        injector = getTestBed();
        service = injector.get(ToolSelectorService);

        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();

    });
    
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when changeTool with pencil changeCurrentToolName should be call with pencil', () => {

        service.changeTool(ToolName.Pencil);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Pencil);
    });

    it('when changeTool with rectagnle changeCurrentToolName should be call with rectangle', () => {

        service.changeTool(ToolName.Rectangle);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Rectangle);
    });

    it('when changeTool with brush changeCurrentToolName should be call with brush', () => {

        service.changeTool(ToolName.Brush);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Brush);
    });

    it('when changeTool with colorApplicator changeCurrentToolName should be call with colorApplicator', () => {

        service.changeTool(ToolName.ColorApplicator);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.ColorApplicator);
    });

    it('when changeTool with tool not implemented yet changeCurrentToolName should be call with his name', () => {

        service.changeTool(ToolName.Polygon);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Polygon);
    });

    it('when changeTool with non existing tool changeCurrentToolName should be call with Selection', () => {

        service.changeTool('non-existing-tool');

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Selection);
    });

    it('when changeCurrentToolName is called with pencil toolName should be pencil', () => {

        service.changeCurrentToolName(ToolName.Pencil);
        console.log(service['toolName']);
    })
});
