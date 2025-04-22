import logger from '../logs.js'
import FreeSwitchConnection from '../fsconn/fs.js'

export const modloadTool = {
    name: 'modload',
    description: 'Load, unload, or reload a FreeSWITCH module',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
            module: { type: 'string', description: 'The module name to load, unload, or reload' },
            action: { type: 'string', description: 'The action to perform: load, unload, or reload' },
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd', 'module', 'action'],
    }
};

export async function modload(args) {
    logger.debug('[modload] modload called with args', args);

    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const command = `${args.action} ${args.module}`;
        const response = await fs.api(command);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[modload]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[modload]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
};
