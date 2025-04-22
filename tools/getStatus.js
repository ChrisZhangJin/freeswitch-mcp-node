import logger from '../logs.js'
import FreeSwitchConnection from '../fsconn/fs.js'

export const getStatusTool = {
    name: 'get_status',
    description: 'Get the status of the FreeSWITCH server',
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

export async function getStatus(args) {
    logger.debug('[getStatus] getStatusTool called with args');

    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api('status');
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[getStatus]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[getStatus]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    }
    finally {
        if (fs) {
            setTimeout(() => {  fs.disconnect(); }, 2000);
        }
    }
}
