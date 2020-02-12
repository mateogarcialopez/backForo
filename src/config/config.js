//port db
process.env.PORT = process.env.PORT || 3000;


//url db
process.env.urlDB = process.env.urlDB || 'mongodb+srv://mateo:mateo@cluster0-iweo7.mongodb.net/foro';


//signatura
process.env.VERIFY_SIGNATURE = process.env.VERIFY_SIGNATURE || 'clavetoken'

//tiempo en que expira el token
process.env.LIFE_TOKEN = process.env.LIFE_TOKEN || '48h'