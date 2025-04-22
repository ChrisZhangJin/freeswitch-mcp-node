import logger from "../logs.js";
import esl from "modesl";

class FreeSwitchConnection {
    constructor(ipaddr, port, pwd) {
        this.fsConnection = null;
        this.fsHost = ipaddr;
        this.fsPort = port;
        this.fsPassword = pwd;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            if (this.fsConnection && this.fsConnection.connected()) {
                resolve("");
                return;
            }

            try {
                logger.debug('[connect]Connecting to FreeSWITCH.' + this.fsHost + ':' + parseInt(this.fsPort) + ' with password ' + this.fsPassword)
                
                this.fsConnection = new esl.Connection(this.fsHost, parseInt(this.fsPort), this.fsPassword);
                this.fsConnection.auth();
                logger.debug('[connect]ESL Connection created and authenticated.');

                this.fsConnection.on('error', (err) => {
                    logger.error('[connect]ESL Connection Error:', err);
                    reject(err);
                });

                resolve("");

            } catch (err) {
                logger.error('[connect]Error connecting to FreeSWITCH:', err);
                reject(err);
            }
        });
    }

    async api(command) {
        try {
            await this.connect();
            return new Promise((resolve, reject) => {
                logger.debug('[api]Sending Command:' + command);
                this.fsConnection.api(command, (response) => {
                    logger.debug('[api] Response Received', response);
                    resolve(response.body);
                });
                setTimeout(() => {
                    reject  ('API Command Timeout');
                }, 2000);
            });
        } catch (err) {
            logger.error('API Command Error:', err);
            return null;
        }
    }

    async sendRecv(command) {
        try {
            await this.connect();
            return new Promise((resolve, reject) => {
                logger.debug('[sendRecv]Sending Command:' + command);
                this.fsConnection.sendRecv(command, (response) => {
                    logger.debug('[sendRecv] Response Received', response);
                    resolve(response.body);
                });
                setTimeout(() => {
                    reject  ('sendRecv Command Timeout');
                }, 2000);
            });
        } catch (err) {
            logger.error('sendRecv Command Error:', err);
            return null;
        }
    }

    // do not use the interface originate from modesl
    // because there is no way to put the arguments in originate command 
    // the options should be in the format of
    // {
    //     profile: 'internal',
    //     call_url: '1001@192.168.1.1',
    //     vars: {
    //         origination_uuid: '12345678-1234-1234-1234-123456789012',
    //         caller_id_number: '1001',
    //         caller_id_name: '1001',
    //         originate_timeout: '30',
    //         sip_invite_domain: 1.2.3.4,
    //         sip_invite_route_uri: <sip:1.2.3.4:5060;lr>
    //     },
    //     app: 'answer'
    // }
    // the app is optional, if not provided, the originate command will use the default app 'echo'
    async originate(options) {
        try {
            // 连接
            await this.connect();
            return new Promise((resolve, reject) => {

                // the options.vars is a dict, if it is not null or undefined, convert it to string
                var args = '';
                if (options.vars) {
                    logger.debug('[originate]options.vars:', options.vars);
                    if (options.vars['origination_uuid']) {
                        args += 'origination_uuid=' + options.vars['origination_uuid'];
                    }
                    logger.debug('[originate]origination_uuid:' + options.vars['origination_uuid']);
                    logger.debug('[originate]args:'+ args);
                    if (options.vars['caller_id']) {
                        args += ',origination_caller_id_number=' + options.vars['caller_id'];
                    }
                    logger.debug('[originate]caller_id:'+ options.vars['caller_id']);
                    logger.debug('[originate]args:' +  args);
                    if (options.vars['caller_name']) {
                        args += ',origination_caller_id_name=' + options.vars['caller_name'];
                    }
                    logger.debug('[originate]caller_name:' + options.vars['caller_name']);
                    logger.debug('[originate]args:' + args);
                    if (options.vars['originate_timeout']) {
                        args += ',originate_timeout=' + options.vars['originate_timeout'];
                    }
                    if (options.vars['invite_domain']) {
                        args += ',sip_invite_domain=' + options.vars['invite_domain'];
                    }
                    if (options.vars['invite_route_uri']) {
                        args += ',sip_invite_route_uri=' + options.vars['invite_route_uri'];
                    }
                }
                logger.debug('[originate]args:' +  args);
                var command = 'originate '+ (args?'{'+args+'}':'') 
                        +'sofia/' + options.profile +
                        '/' + options.call_url + 
                        (options.app ? ' &' + options.app : '');

                logger.debug('[originate]Sending Command:' + command);

                this.fsConnection.api(command, (response) => {
                    logger.debug('[originate] Response Received', response);
                    resolve(response.body);
                });
                // if send without any error back, it won't get any response saying working fine.
                // it's so weird. let's take it as a success if no error returns
                setTimeout(() => {
                    resolve('');
                }, 10000);
            });
        } catch (err) {
            logger.error('Originate Command Error:', err);
            return null;
        }
    }

    disconnect() {
        if (this.fsConnection) {
            this.fsConnection.disconnect();
            logger.info('Disconnected from FreeSWITCH');
        }
    }
}

export default FreeSwitchConnection;