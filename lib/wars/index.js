var derby = require('derby')
  , wars = derby.createApp(module)
  , get = wars.get
  , view = wars.view
  , ready = wars.ready
  , start = +new Date()

derby.use(require('../../ui'))


// ROUTES //

get('/', function(page, model, params) {

  model.set('_cityName', 'Something');
  model.setNull('cities.coll', [
    {
      name : 'defaultCity',
      special : 'hadouken'
    }
  ]);
  model.setNull('cities._settings.count', 1);

  model.subscribe('cities.coll', function(err, cities) {
    model.ref('_cities', cities);
    cities.setNull('coll', [
      {
        name : 'defaultCity',
        special : 'hadouken'
      }
    ]);
    console.log(cities)
    page.render({
      cities : cities
    });
  })

})

// Derby routes can be rendered on the client and the server
get('/cities/:cityName?', function(page, model, params) {
  var cityName = params.cityName || 'home'
console.log(page);
  // Subscribes the model to any updates on this city's object. Calls back
  // with a scoped model equivalent to:
  //   city = model.at('citys.' + cityName)
  model.subscribe('cities.' + cityName, function(err, city) {
    model.ref('_city', city)

    // setNull will set a value if the object is currently null or undefined
    city.setNull('welcome', 'Welcome to ' + cityName + '!')

    city.incr('visits')

    // This value is set for when the page initially renders
    model.set('_timer', '0.0')
    // Reset the counter when visiting a new route client-side
    start = +new Date()

    // Render will use the model data as well as an optional context object
    page.render('wars:city', {
      cityName: cityName
    , randomUrl: parseInt(Math.random() * 1e9).toString(36)
    })
  })
})


// CONTROLLER FUNCTIONS //

ready(function(model) {
  var timer

  this.createCity = function() {
    var cityCount
      , cityName = model.get('_cityName');

    model.incr('cities.settings.count');
    cityCount = model.get('cities.settings.count')

    cityCount = model.push('cities.coll', {
      name : cityName
    });
  }

  // Functions on the app can be bound to DOM events using the "x-bind"
  // attribute in a template.
  this.stop = function() {
    // Any path name that starts with an underscore is private to the current
    // client. Nothing set under a private path is synced back to the server.
    model.set('_stopped', true)
    clearInterval(timer)
  }

  this.start = function() {
    model.set('_stopped', false)
    timer = setInterval(function() {
      model.set('_timer', (((+new Date()) - start) / 1000).toFixed(1))
    }, 100)
  }
  this.start()

})
