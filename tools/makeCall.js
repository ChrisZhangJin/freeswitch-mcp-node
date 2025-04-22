import logger from '../logs.js'
import FreeSwitchConnection from '../fsconn/fs.js'

export const makeCallTool = {
    name: 'make_call',
    description: 'Make a call to a SIP destination',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
            call_url: { type: 'string', description: 'The SIP destinatin to call. e.g. 1001@192.168.1.1' },
            caller_id: { type: 'string', description: 'The caller id to use' },
            caller_name: { type: 'string', description: 'The caller name to display' },
            origination_uuid: { type: 'string', description: 'The uuid of this call, which can be used as uuid parameter in the uuid tools. you can generate it as long as it won\'t be duplicated' },
            app: { type: 'string', description: 'The application to run after the call is answered. the common app that you can use: echo(), park(), playback() etc. ' },
            timeout: { type: 'int', description: 'The timeout for the call in seconds. default is 30' },
            invite_domain: { type: 'string', description: 'The domain to use for the invite. default is the domain of the call_url' },
            invite_route_uri: { type: 'string', description: 'The route uri to use for the invite. default is the route uri of the call_url' },
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd', 'call_url', 'origination_uuid'],
    }
};

export const showCallsTool = {
    name: 'show_calls',
    description: 'Show all calls in FreeSwitch',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export async function makeCall(args) {
    logger.debug('[makeCall] makeCall called with args', args);
    // Default values for options
    let options = {};
    options.profile = 'external';
    options.call_url = args.call_url;
    options.app = args.app || 'echo()';
    options.vars = {};
    options.vars.caller_id = args.caller_id;
    options.vars.caller_name = args.caller_name;
    options.vars.origination_uuid = args.origination_uuid;
    options.vars.originate_timeout = args.timeout || 30;
    options.vars.invite_domain = args.invite_domain;
    options.vars.invite_route_uri = args.invite_route_uri;
    logger.debug('[makeCall] options: ', options);


    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.originate(options);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[makeCall]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[getGateways]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    }
    finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
};

export async function showCalls(args) {
    logger.debug('[showCalls] showCalls called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api('show calls');
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[showCalls]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        }
    } catch (err) {
        logger.error(`[showCalls]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}