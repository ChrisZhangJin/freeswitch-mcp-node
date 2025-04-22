import { getGatewaysTool, getGateways } from './getGateways.js';
import { makeCallTool, makeCall, showCallsTool, showCalls } from './makeCall.js';
import { getStatusTool, getStatus  } from './getStatus.js';
import { modloadTool, modload } from './modload.js';
import { reloadxmlTool, reloadxml } from './reloadxml.js';
import { uuidAnswerTool, uuidAnswer, uuidRecordTool, uuidRecord, uuidBreakTool, uuidBreak, uuidParkTool, uuidPark } from './uuidAnswer.js';

export const tools = [getGatewaysTool, makeCallTool, showCallsTool,getStatusTool, modloadTool, reloadxmlTool, uuidAnswerTool, uuidRecordTool, uuidBreakTool, uuidParkTool];

export const toolHandlers = {
    [getGatewaysTool.name]: getGateways,
    [makeCallTool.name]: makeCall,
    [getStatusTool.name]: getStatus,
    [modloadTool.name]: modload,
    [reloadxmlTool.name]: reloadxml,
    [showCallsTool.name]: showCalls,
    [uuidAnswerTool.name]: uuidAnswer,
    [uuidRecordTool.name]: uuidRecord,
    [uuidBreakTool.name]: uuidBreak,
    [uuidParkTool.name]: uuidPark,
  };
