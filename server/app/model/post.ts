import { createSchema, Type, typedModel } from 'ts-mongoose';
import { IDrawing } from '../../../common/communication/Drawing';

const drawingSchema = createSchema({
    name: Type.string({ required: true }),
    labels: Type.array().of(Type.string({ required: true })),
    svg: Type.string({ required: true }),
    idStack: Type.array().of(Type.string({ required: true })),
    drawingInfo: Type.object().of({
        width: Type.number({ required: true }),
        height: Type.number({ required: true }),
        color: Type.string({ required: true }),
    }),
});

export const Drawing = typedModel('Drawing', drawingSchema);
