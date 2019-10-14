import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';

import { Message } from '../../../common/communication/message';
const Post = require('../model/post');

@injectable()
export class FileManagerController {
	public router: Router;

	constructor() {
		this.configureRouter();
	}

	private configureRouter(): void {
		this.router = Router();

		this.router.get('/open', async (req: Request, res: Response, next: NextFunction) => {
			// Send the request to the service and send the response
			let message: Message = { title: 'AILLLLLE', body: 'HELLLOOOOOO P9' };
			res.json(message);
		});

		this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
			// Send the request to the service and send the response
			const message = req.body;
			let post = new Post(message);
			post.save();
			// console.log('hi ->', message);
			res.json(message);
		});
	}
}
