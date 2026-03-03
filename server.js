const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use("/", express.static('/views'));


app.use((req, res, next) => {
    console.log("request body: ", req.body);
    console.log(req.method + ' ' + req.url + ' was requested at ' + Date(Date.now()).toString());
    next();
})


const guitarOptions = {
    shapes: ['Dreadnought', 'Stratocaster', 'Les Paul', 'Telecaster', 'Parlor', 'Auditorium'],
    colors: ['Sunburst', 'Black', 'White', 'Seafoam Green', 'Surf Green', 'Natural', 'Cherry Red'],
    headstocks: ['Fender S-Style', 'Gibson LP-Style', 'Straight', 'Pointed', 'V-Shape'],
    fretboards: [
        { name: 'Rosewood', desc: 'warm, rich' },
        { name: 'Maple', desc: 'bright, snappy' },
        { name: 'Ebony', desc: 'dense, clear' }
    ],
    bodywoods: [
        { name: 'Alder', desc: 'vintage, balanced' },
        { name: 'Mahogany', desc: 'warm, resonant' },
        { name: 'Basswood', desc: 'even midrange' },
        { name: 'Ash', desc: 'bright, punchy' }
    ],
    pickups: [
        { name: 'Single Coil', desc: 'clear, bright' },
        { name: 'Humbucker', desc: 'thick, hum-free' },
        { name: 'P90', desc: 'gritty, versatile' },
        { name: 'Gold Foil', desc: 'vintage vibe' }
    ],
    hardware: ['Chrome (bright, shiny)', 'Nickel (warm, aged look)', 'Gold (luxury)', 'Black (stealth)']
};

const guitarPricing = {
    basePrice: 1299,
    bodywoodPricing: {
        'Ebony': 199,
        'Mahogany': 149,
        'Ash': 179
    },
    pickupPricing: {
        'Humbucker': 299,
        'P90': 249,
        'Gold Foil': 199
    }
};

app.get("/", async (req, res, next) => {
    res.render("home");
});

app.get("/customize", async (req, res, next) => {
    res.render("customize");
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.post("/customize", async (req, res, next) => {
    console.log('Guitar Build Received:', req.body);
    res.json({ 
        success: true, 
        message: 'Build specs saved!', 
        data: req.body 
    });
});

//port
app.listen(process.env.PORT || 8099);
