import { createSchema, typedModel } from 'ts-mongoose';

const postSchema = createSchema ({
    title: { type: String, require: true },
    body: { type: String, require: true },
});

export const Post = typedModel('Post', postSchema);
