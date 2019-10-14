import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';

import { Message } from '../../../common/communication/Message';
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
			Post.findOne({ title: 'OMG' })
				.then((ans: Message) => {
					res.json(ans);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});

		this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
			// Send the request to the service and send the response

			let query = { title: req.body.title };
			let update = new Post(req.body);
			let options = { upsert: true, new: true };

			Post.findOneAndUpdate(query, update, options)
				.then((ans: Message) => {
					console.log(ans);
					res.json(ans);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});
	}
}
