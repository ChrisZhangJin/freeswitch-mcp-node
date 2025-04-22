import logger from '../logs.js'
import FreeSwitchConnection from '../fsconn/fs.js'

export const reloadxmlTool = {
    name: 'reloadxml',
    description: 'reloadxml file for Freeswitch in order that the xml change can take effect. e.g. the dialplan change can take effect by using this tool',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' }
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd'],
    }
};

export async function reloadxml(args) {
    logger.debug('[reloadxml] reloadxml called with args', args);

    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api('reloadxml');
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[reloadxml]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[reloadxml]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
};
