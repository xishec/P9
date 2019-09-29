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
        // Arrange
        service.drawStack.push(mockSVGGElement);
        // Act
        const returnedElement: any = service.getElementByPosition(0);
        // Assert
        expect(returnedElement).toEqual(mockSVGGElement);
    });

    it(`when getDrawStackLenght after ${NB_PUSH} push then should return lenght of ${NB_PUSH}`, () => {
        // Arrange
        for (let i = 0; i < NB_PUSH; i++) {
            service.drawStack.push(mockSVGGElement);
        }
        // Act
        const nbElements = service.getDrawStackLength();
        // Assert
        expect(nbElements).toBe(NB_PUSH);
    });

    it('when push SVGGElement drawStack should contain the element', () => {
        // Arrange
        // Act
        service.push(mockSVGGElement);
        // Assert
        expect(service.drawStack).toContain(mockSVGGElement);
    });

    it('when pop return the last element and drawStack does not contain element', () => {
        // Arrange
        service.drawStack.push(mockSVGGElement);
        // Act
        const popElement = service.pop();
        // Assert
        expect(popElement).toEqual(mockSVGGElement);
        expect(service.drawStack).not.toContain(mockSVGGElement);
    });

    it('when reset then drawStack is empty and length zero', () => {
        // Arrange
        for (let i = 0; i < NB_PUSH; i++) {
            service.drawStack.push(mockSVGGElement);
        }
        // Act
        service.reset();
        // Assert
        expect(service.drawStack.length).toBe(0);
        expect(service.drawStack).not.toContain(mockSVGGElement);
    });
});
