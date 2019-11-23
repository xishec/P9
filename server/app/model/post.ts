import { createSchema, Type, typedModel } from 'ts-mongoose';

const drawingSchema = createSchema({
    name: Type.string({ required: true }),
    labels: Type.array().of(Type.string({ required: true })),
    idStack: Type.array().of(Type.string({ required: true })),
    width: Type.number({ required: true }),
    height: Type.number({ required: true }),
    color: Type.string({ required: true }),
    createdOn: Type.number({ required: true }),
    lastModified: Type.number({ required: true }),
});

export const DrawingModel = typedModel('DrawingInfo', drawingSchema);
