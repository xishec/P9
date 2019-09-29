import { DrawStackService } from './draw-stack.service';

const NB_PUSH = 3;

describe('DrawStackService', () => {
    let service: DrawStackService;
    const mockSVGGElement: any = {};

    beforeEach(() => {
        service = new DrawStackService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when getElementByPosition then returns element in drawStack at position', () => {
        // tslint:disable-next-line: no-string-literal
        service['drawStack'].push(mockSVGGElement);

        const returnedElement: any = service.getElementByPosition(0);

        expect(returnedElement).toEqual(mockSVGGElement);
    });

    it(`when getDrawStackLenght after ${NB_PUSH} push then should return lenght of ${NB_PUSH}`, () => {
        for (let i = 0; i < NB_PUSH; i++) {
            // tslint:disable-next-line: no-string-literal
            service['drawStack'].push(mockSVGGElement);
        }

        const nbElements = service.getDrawStackLength();

        expect(nbElements).toBe(NB_PUSH);
    });

    it('when push SVGGElement drawStack should contain the element', () => {
        service.push(mockSVGGElement);

        // tslint:disable-next-line: no-string-literal
        expect(service['drawStack']).toContain(mockSVGGElement);
    });

    it('when pop return the last element and drawStack does not contain element', () => {
        // tslint:disable-next-line: no-string-literal
        service['drawStack'].push(mockSVGGElement);

        const popElement = service.pop();

        expect(popElement).toEqual(mockSVGGElement);
        // tslint:disable-next-line: no-string-literal
        expect(service['drawStack']).not.toContain(mockSVGGElement);
    });

    it('when reset then drawStack is empty and length zero', () => {
        for (let i = 0; i < NB_PUSH; i++) {
            // tslint:disable-next-line: no-string-literal
            service['drawStack'].push(mockSVGGElement);
        }

        service.reset();

        // tslint:disable-next-line: no-string-literal
        expect(service['drawStack'].length).toBe(0);
        // tslint:disable-next-line: no-string-literal
        expect(service['drawStack']).not.toContain(mockSVGGElement);
    });
});
