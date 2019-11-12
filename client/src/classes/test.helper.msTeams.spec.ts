import { Provider, Type } from '@angular/core';

export type Mock<T> = T & { [F in keyof T]: T[F] & jasmine.Spy };

// Great method inspired by https://christianlydemann.com/all-you-need-to-know-about-mocking-in-angular-tests/
export const autoMock: <T>(type: Type<T>) => Mock<T> = <T>(type: Type<T>): Mock<T> => {
    const provider: Partial<Mock<T>> = {};

    const installProtoMethods = (proto: any) => {
        if (proto === null || proto === Object.prototype) {
            return;
        }

        for (const key of Object.getOwnPropertyNames(proto)) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key) as PropertyDescriptor;

            if (typeof descriptor.value === 'function' && key !== 'constructor') {
                (provider as any)[key] = jasmine.createSpy(key);
            }
        }

        installProtoMethods(Object.getPrototypeOf(proto));
    };

    installProtoMethods(type.prototype);

    return provider as Mock<T>;
};

export const provideAutoMock: <T>(type: Type<T>) => Provider = <T>(type: Type<T>): Provider => ({
    provide: type,
    useFactory: () => autoMock(type),
});
