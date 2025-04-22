import logger from '../logs.js'
import FreeSwitchConnection from '../fsconn/fs.js'

// UUID-based FreeSWITCH API functions

export const uuidAnswerTool = {
    name: 'uuid_answer',
    description: 'Answer an ringing call by uuid',
    inputSchema: {
        type: 'object',
        properties: {
            uuid: { type: 'string', description: 'The uuid of the call' },
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['uuid', 'esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export const uuidRecordTool = {
    name: 'uuid_record',
    description: 'Record a call by uuid',
    inputSchema: {
        type: 'object',
        properties: {
            uuid: { type: 'string', description: 'The uuid of the call' },
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['uuid', 'esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export const uuidBreakTool = {
    name: 'uuid_break',
    description: 'Break operation is used for interruptting a broadcast operation',
    inputSchema: {
        type: 'object',
        properties: {
            uuid: { type: 'string', description: 'The uuid of the call' },
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['uuid', 'esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export const uuidBridgeTool = {
    name: 'uuid_bridge',
    description: 'Bridge two calls by uuid',
    inputSchema: {
        type: 'object',
        properties: {
            uuid1: { type: 'string', description: 'The uuid of the first call' },
            uuid2: { type: 'string', description: 'The uuid of the second call' },
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['uuid1', 'uuid2', 'esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export const uuidParkTool = {
    name: 'uuid_park',
    description: 'Park a call by uuid',
    inputSchema: {
        type: 'object',
        properties: {
            uuid: { type: 'string', description: 'The uuid of the call' },
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['uuid', 'esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export const uuidKillTool = {
    name: 'uuid_kill',
    description: 'Kill a call by uuid',
    inputSchema: {
        type: 'object',
        properties: {
            uuid: { type: 'string', description: 'The uuid of the call' },
            esl_addr: { type: 'string', description: 'The esl address IP' },
            esl_port: { type: 'int', description: 'The esl port' },
            esl_pwd: { type: 'string', description: 'The esl password' },
        },
        required: ['uuid', 'esl_addr', 'esl_port', 'esl_pwd'],
    }
}

export async function uuidAnswer(args) {
    logger.debug('[uuidAnswer] uuidAnswer called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`uuid_answer ${args.uuid}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[uuidAnswer]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[uuidAnswer]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}

export async function uuidRecord(args) {
    logger.debug('[uuidRecord] uuidRecord called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`uuid_record ${args.uuid} ${args.filename}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[uuidRecord]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[uuidRecord]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}

export async function uuidBreak(args) {
    logger.debug('[uuidBreak] uuidBreak called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`uuid_break ${args.uuid}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[uuidBreak]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[uuidBreak]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}

export async function uuidBridge(args) {
    logger.debug('[uuidBridge] uuidBridge called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`uuid_bridge ${args.uuid} ${args.destination}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[uuidBridge]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[uuidBridge]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}

export async function uuidPark(args) {
    logger.debug('[uuidPark] uuidPark called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`uuid_park ${args.uuid}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[uuidPark]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[uuidPark]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}

export async function uuidKill(args) {
    logger.debug('[uuidKill] uuidKill called with args', args);
    let fs = null;
    try {
        fs = new FreeSwitchConnection(args.esl_addr, args.esl_port, args.esl_pwd);
        const response = await fs.api(`uuid_kill ${args.uuid}`);
        if (!response) {
            return { error: 'Unable to connect to FreeSWITCH' };
        }

        logger.info(`[uuidKill]response: ${response}`);
        return {
            content: [{ type: "text", text: response }],
        };
    } catch (err) {
        logger.error(`[uuidKill]Error: ${err}`);
        return { content: [{ type: "error", text: err }] };
    } finally {
        if (fs) {
            setTimeout(() => { fs.disconnect(); }, 2000);
        }
    }
}
