const express = require("express")
const mongoose = require("mongoose")
const hbs     = require('hbs');
const app = express()
const PORT = 3000
mongoose.connect('mongodb://localhost/movies');
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open');
});

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

const schema = {
    title: String,
    year: Number,
    director: String,
    duration: String,
    genre: [String],
    rate: Number
}

const Movie = mongoose.model('movie', schema);
const Cat = mongoose.model('cat', { name: String });

app.get("/new-cat", (req, res) => {
    log()

    Cat
        .create({ name: "a" })
        .then((catData) => {
            res.json(catData)
        })
        .catch()
})

app.get("/add-new-movie-test", (req, res) => {
    log()
    Movie.create({
        title: "peli 0619",
        year: 2019,
        director: "c trujillo",
        duration: `${Math.round(Math.random() * 5)}h 20m`,
        genre: [
            "terror",
            "comedy",
            "romance"
        ],
        rate: 9.5
    }).then((err, data) => {
        res.json({ recordAdded: true })
    })
})

// this is an endpoint
app.get("/movies", (req, res) => {
    Movie.find({ "year": { $gte: 1979, $lte: 1989 } }, (err, movies) => {
        res.json(movies)
    });
})

// this is an endpoint
app.get("/movie/:movieID", (req, res) => {
    Movie.findById(req.params.movieID, (err, movie) => {
        res.json(movie)
    });
})

// this is an endpoint
app.get("/moviesByRating/:rating", (req, res) => {
    // const rating = sanitize(+req.params.rating)
    Movie.find({ "rate": +req.params.rating }, (err, movies) => {
        res.json(movies)
    });
})

app.get("/movie-rates", (req, res) => {
    Movie.find({ year: { $eq: 1980 } }, (err, movies) => {
        let moviesOutput = movies
            .map(movie => movie.rate)
            .reduce((ac, cu) => ac + cu) / movies.length

        res.json({
            "average-rate": moviesOutput
        })
    });
})

app.get('/hello', (req, res, next) => {
    res.send(`
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="stylesheets/style.css">
        </head>
        <body>
          This is my ${Math.random() * 100} route
        </body>
      </html>
    `);
});

// here we are entering in home, aka. http://localhost:3000/
/* 

app.get('/', (req, res, next) => {
    // here we are crafting the data that you are about to pass to the handlebars view
    // for its processing
    let data = {
        name: "Ironhacker",
        bootcamp: "IronHack WebDev"
    };

    // here you send the data to the index view living in the /views folder
    // renders the computation of the handlebars + the data
    // and sends back the result to the requester (in this case, the browser :) )
    res.render('index', data);
});

*/

app.get('/agus', (req, res, next) => {
    let data = { nombre: "danielito2", value: Math.random() + 100 }

    res.render('index', data);
});

app.get("/displayAllMoviesInHandlebars/:order", (req, res) => {
    let filter = {}
    Movie
        .find(filter)
        .sort({ year: +req.params.order })
        .then(moviesLoadedFromMongo => {
            let averageCalculated = moviesLoadedFromMongo.reduce((ac, cu) => ac + cu.rate, 0) / moviesLoadedFromMongo.length

            // canonical notation
            // res.render("handleBarsView", < dataForTheView >)

            res.render("movies", { isAdmin: true, isEditor: false, mediaEnSpanish: averageCalculated, pelis: moviesLoadedFromMongo, ...filter })
        })
})

app.get("/players", (req, res) => {
    const players = [
        {
            'name': 'Rusell',
            'lastName': 'Westbrook',
            'team': 'OKC',
            'photo': 'https://thunderousintentions.com/wp-content/uploads/getty-images/2017/12/891998404-oklahoma-city-thunder-v-indiana-pacers.jpg.jpg'
        },
        {
            'name': 'Kevin',
            'lastName': 'Durant',
            'team': 'GSW',
            'photo': 'https://img.bleacherreport.net/img/images/photos/003/670/482/hi-res-3c2473cd8600df96c4b94c93808562c8_crop_north.jpg?h=533&w=800&q=70&crop_x=center&crop_y=top'
        },
        {
            'name': 'Lebron',
            'lastName': 'James',
            'team': 'CLE',
            'photo': 'https://usatftw.files.wordpress.com/2018/01/ap_cavaliers_timberwolves_basketball.jpg?w=1000&h=600&crop=1'
        },
        {
            'name': 'Emanuel',
            'lastName': 'Ginóbilli',
            'team': 'SAS',
            'photo': 'https://cdn.vox-cdn.com/thumbor/Z9kR0HDJrzOzxOdwGe7Jwyxxvjk=/0x0:2802x4203/1200x800/filters:focal(1329x1158:1777x1606)/cdn.vox-cdn.com/uploads/chorus_image/image/57733525/usa_today_10429631.0.jpg'
        },
        {
            'name': 'Kyrie',
            'lastName': 'Irving',
            'team': 'BOS',
            'photo': 'https://cdn-s3.si.com/s3fs-public/styles/marquee_large_2x/public/2017/11/11/kyrie-irving-mvp-case.jpg?itok=PWYqUSGf'
        },
        {
            'name': 'Kobe',
            'lastName': 'Bryant',
            'team': 'LAK',
            'photo': 'https://clutchpoints.com/wp-content/uploads/2017/10/Kobe-Bryant-e1508564618882.jpg'
        },
    ];

    res.render("players", {players})

})

app.listen(PORT)

function log() {
    console.log("hola")
}