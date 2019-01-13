import * as http from 'http';
import app from './app';
import db from './models'
import { normalizePort, onListening, onError } from './utils/PortUtils';

const server = http.createServer(app);
const port = normalizePort(process.env.port || 3000 )

db.sequelize.sync()
.then(() => {
    server.listen(port);
    server.on('error', onError(server));
server.on('http://localhost:', onListening(server) ); 
})