const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


module.exports = {
	index: (req, res, next) => {
		Order.find().select('product quantity _id')
			.populate('product', 'name')
			.exec()
			.then(docs => {
				console.log(docs);
				res.status(200).json({
					count: docs.length,
					orders: docs.map(doc => {
						return {
							_id: doc.id,
							product: doc.product,
							quantity: doc.quantity,
							request: {
								type: 'GET',
								url: 'localhost:3000/orders/' + doc._id
							}
						}
					})
				});
			}).catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},

	store: (req, res, next) => {
		Product.findById(req.body.productId)
			.then(product => {
				if (!product) {
					return res.status(404).json({
						message: "Product not found"
					});
				}
				const order = new Order({
					_id: mongoose.Types.ObjectId(),
					quantity: req.body.quantity,
					product: req.body.productId
				});
				return order.save();
			})
			.then(result => {
				console.log(result);
				res.status(201).json({
					message: "Order stored",
					createdOrder: {
						_id: result._id,
						product: result.product,
						quantity: result.quantity
					},
					request: {
						type: "GET",
						url: "http://localhost:3000/orders/" + result._id
					}
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},

	show: (req, res, next) => {
		Order.findById(req.params.orderId)
			.populate('product')
			.exec()
			.then(order => {
				if (!order) {
					res.status(404).json({
						message: 'Order not found!',
					});
				}
				res.status(200).json({
					order: order,
					request: {
						type: 'GET',
						url: 'localhost:3000/orders'
					}
				})
			}).catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				})
			});
	},

	delete: (req, res, next) => {
		Order.remove({
			_id: req.params.orderId
		}).then(result => {
			res.status(200).json({
				message: 'Order was deleted!',
				body: {
					product: 'ID',
					quantity: 'Number',
					request: {
						type: 'POST',
						url: 'localhost:3000/orders'
					}
				}
			})
		}).catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
	}
}
