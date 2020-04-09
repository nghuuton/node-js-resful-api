const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const cors = require('cors')
mongoose.connect('mongodb://localhost:27017/demo', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
})

mongoose.Promise = global.Promise;

app.use(morgan('dev'))
app.use(bodyParse.urlencoded({
   extended: false
}));
app.use(bodyParse.json());
app.use(cors());
app.use('/public', express.static('public'))
// Router 
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
   const error = new Error('Not found');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message
      }
   })
});

module.exports = app;