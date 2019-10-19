import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';

import { Message } from '../../../common/communication/Message';
import { Drawing } from '../../../common/communication/Drawing';
const Post = require('../model/post');

@injectable()
export class FileManagerController {
	public router: Router;

	constructor() {
		this.configureRouter();
	}

	private configureRouter(): void {
		this.router = Router();

		this.router.get('/get-all-drawing', async (req: Request, res: Response, next: NextFunction) => {
			let query = { title: /Add Drawing/i };

			Post.find(query)
				.then((ans: Message) => {
					res.json(ans);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});

		this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
			let message: Message = req.body;

			let drawing: Drawing = JSON.parse(message.body);
			if (drawing.name === '' || drawing.labels.includes('') || drawing.svg === '') {
				let error: Message = {
					title: 'Invalid Drawing',
					body: 'Invalid Drawing',
				};
				res.json(error);
			}

			let query = { title: message.title };
			let update = { body: message.body };
			let options = { upsert: true, new: true };

			Post.findOneAndUpdate(query, update, options)
				.then((ans: Message) => {
					res.json(ans);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});
	}
}
