app.locals -> properties persist throughout the life of the application
res.locals ->properties that are valid only for the lifetime of the request
=======================================================================
hbs has the ability to expose the application and request locals within any 
context inside a view. To enable this functionality, simply call the localsAsTemplateData
 method and pass in your Express application instance.