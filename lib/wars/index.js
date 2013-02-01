var derby = require('derby')
  , wars = derby.createApp(module)
  , get = wars.get
  , view = wars.view
  , ready = wars.ready
  , start = +new Date()

derby.use(require('../../ui'))


// ROUTES //

get('/', function(page, model, params) {

  var cities

  model.setNull('dw.cities', [
    {
      name : 'defaultVille'
    }
  ]);
  model.setNull('dw.settings.count', 1);
console.log(model.get('dw.cities'));
  //model.subscribe('dw.cities', function( err, cities ) {
    
    page.render('home', {
      cities : cities
    });

  //});

})

get('/cities/:cityName?', function(page, model, params) {

  page.render('wars', {});

})


// CONTROLLER FUNCTIONS //

ready(function(model) {
  var timer

  this.createCity = function() {
    var cityCount
      , cityName = model.get('_cityName');

    model.incr('dw.settings.count');
    cityCount = model.get('dw.settings.count')

    cityCount = model.push('dw.cities', {
      name : cityName
    });

    console.log(model.get('dw.cities'));
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
