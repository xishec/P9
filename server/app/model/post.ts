import { createSchema, Type, typedModel } from 'ts-mongoose';

const postSchema = createSchema({
    title: Type.string({ required: true }),
    body: Type.string({ required: true }),
});

export const Post = typedModel('Post', postSchema);
