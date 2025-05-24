const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const upload = require('./middleware/upload');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Admin route for adding products
app.post('/admin/products',
    upload.single('productImage'), (req, res) => {
    require('./handlers/products/add').handler(req)
        .then(response => res.status(response.statusCode).json(JSON.parse(response.body)))
        .catch(error => res.status(500).json({ error: error.message }))
});

// Public route for listing products
app.get('/products', (req, res) =>{
    require('./handlers/products/list').handler(req)
        .then(response => res.status(response.statusCode).json(JSON.parse(response.body)))
        .catch(error => res.status(500).json({ error: error.message }))
});

app.post('/register',
    upload.single('profilePic'), 
    async (req, res, next) => {
        try {
            const event = {
                body: JSON.stringify(req.body),
                file: req.file
            };
            const response = await require('./handlers/auth/register').handler(event);
            res.status(response.statusCode).json(JSON.parse(response.body));
        } catch (error) {
            next(error);
        }
    }
);

app.post('/login', (req, res) => {
    require('./handlers/auth/login').handler(req)
        .then(response => res.status(response.statusCode).json(JSON.parse(response.body)))
        .catch(error => res.status(500).json({ error: error.message }));
});


app.use(express.json());

app.post('/cart/add',
    require('./middleware/auth'),
    (req, res) => {
        require('./handlers/cart/add').handler({ ...req, user: req.user })
            .then(response => res.status(response.statusCode).json(JSON.parse(response.body)))
            .catch(error => res.status(500).json({ error: error.message }));
    }
);

app.post('/cart/remove',
    require('./middleware/auth'),
    (req, res) => {
        require('./handlers/cart/remove').handler({ ...req, user: req.user })
            .then(response => res.status(response.statusCode).json(JSON.parse(response.body)))
            .catch(error => res.status(500).json({ error: error.message }));
    }
);

app.get('/cart',
    require('./middleware/auth'),
    (req, res) => {
        require('./handlers/cart/get').handler({ ...req, user: req.user })
            .then(response => res.status(response.statusCode).json(JSON.parse(response.body)))
            .catch(error => res.status(500).json({ error: error.message }));
    }
);

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_TYPES') {
        return res.status(422).json({ error: 'Only images are allowed' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(422).json({
            error: `Too large. Max size is ${5}MB`
        });
    }
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


