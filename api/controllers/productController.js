const mongoose = require('mongoose');

const Product = require('../models/product');

module.exports = {
   index: (req, res, next) => {
      Product.find()
         .select('name price _id productImage')
         .exec()
         .then(docs => {
            const respone = {
               count: docs.length,
               products: docs.map(doc => {
                  return {
                     name: doc.name,
                     price: doc.price,
                     productImage: doc.productImage,
                     _id: doc._id,
                     request: {
                        type: 'GET',
                        url: 'http:localhost:3000/products/' + doc._id
                     }
                  }
               })
            };
            // if (docs.length >= 0) {
            res.status(200).json(respone);
            // } else {
            //    res.status(404).json({
            //       message: 'No data!'
            //    })
            // }
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({
               error: err
            });
         });
   },


   store: (req, res, next) => {
      console.log(req.file);
      const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         name: req.body.name,
         price: req.body.price,
         productImage: req.file.path
      });
      product.save().then(result => {
         console.log(result)
         res.status(201).json({
            message: 'Create product successfully',
            createdProduct: {
               name: result.name,
               price: result.productId,
               _id: result._id,
               request: {
                  type: 'GET',
                  url: 'http:localhost:3000/products/' + result._id
               }
            }
         });
      }).catch(err => {
         console.log(err)
         res.status(500).json({
            error: err
         })
      });

   },

   show: (req, res, next) => {
      const id = req.params.productId;
      Product.findById(id)
         .select('name price _id productImage')
         .exec()
         .then(doc => {
            console.log(doc)
            if (doc) {
               res.status(200).json({
                  product: doc,
                  request: {
                     type: 'GET',
                     description: 'Get all products',
                     url: 'http:localhost:3000/products/'
                  }
               })
            } else {
               res.status(404).json({
                  message: 'No valid entry found for provided ID'
               });
            }
         })
         .catch(err => {
            console.log(err)
            res.status(500).json({
               error: err
            });
         });
   },

   update: (req, res, next) => {
      const id = req.params.productId;
      const updateOps = {};
      for (const ops of req.body) {
         updateOps[ops.propName] = ops.value;
      }
      Product.update({
            _id: id
         }, {
            $set: updateOps
         })
         .exec().then(result => {
            res.status(200).json({
               message: 'Product updated!',
               url: 'http:localhost:3000/products/' + id
            });
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({
               error: err
            });
         });
   },
   delete: (req, res, next) => {
      const id = req.params.productId
      Product.remove({
            _id: id
         })
         .exec().then(result => {
            res.status(200).json({
               message: 'Product was deleted!',
               request: {
                  type: 'POST',
                  url: 'http:localhost:3000/products',
                  body: {
                     name: 'String',
                     price: 'Number'
                  }
               }
            });
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({
               error: err
            });
         });
   }
}