import logger from "../logs";


export const sendCmdTool = {
    name: 'send_cmd',
    description: 'send an esl command directly',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
            cmd: { type: 'string', description: 'The esl command' },
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd', 'cmd'],
    }
}

export const sendBatchCmdTool = {
    name: 'send_batch_cmd',
    description: 'send a batch of esl command directly',
    inputSchema: {
        type: 'object',
        properties: {
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
            cmds: { type: 'string', description: 'The batch of esl commands, seperated by char \'\n\'' },
        },
        required: ['esl_addr', 'esl_port', 'esl_pwd', 'cmds'],
    }
}


export async function sendCmd(args) {
    logger.debug('[sendCmd] command args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`${args.cmd}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[sendCmd]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[sendCmd]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}


export async function sendBatchCmd(args) {
    logger.debug('[sendBatchCmd] command args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);

        const cmds = args.cmds.split('\n');
        const responses = [];
        for (const cmd of cmds) {
            logger.debug(`[sendBatchCmd] sending cmd: ${cmd}`);
            const response = await fs.api(`${args.cmd}`);
            if (!response) {
                responses.push(`[response ${cmd}]:  ${response}`);
            }
        }

        logger.info(`[sendBatchCmd]response: ${responses}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[sendCmd]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}