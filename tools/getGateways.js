import logger from '../logs.js'
import FreeSwitchConnection from '../fsconn/fs.js'

export const getGatewaysTool = {
    name: 'get_gateways',
    description: 'Get all available gateway information for outbound calls',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd'],
    }
};


export async function getGateways(args) {
    logger.debug('[getGateways]]getGatewaysTool called with args');

    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api('sofia status gateways');
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[getGateways]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[getGateways]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    }
    finally {
        if (fs) {
            setTimeout(() => {  fs.disconnect(); }, 2000);
        }
    }

};



