import FreeSwitchConnection   from './fsconn/fs.js';
import logger from './logs.js';

const fsconn  = new FreeSwitchConnection('192.168.32.101', 10021, 'zhexinit');
fsconn.api('sofia status gateways').then(function(response) {
    logger.info('[!!]Response:' + response.body);
}, function(error) {
    logger.error('[!!]Error:' + error);
});

logger.info('[main]FreeSWITCH connection established');

setTimeout(() => {
    fsconn.disconnect();
    logger.info('FreeSWITCH connection closed');
}, 5000);