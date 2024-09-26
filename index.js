require('dotenv').config();

const { time } = require('./functions');
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
   console.log(time() +`Servidor escuchando en el puerto ${PORT}`);
 });
