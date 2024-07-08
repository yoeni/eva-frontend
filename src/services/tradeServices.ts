import { SendGet } from "../utils/request";

export const getAllShares = async (token: string) => {
    return await SendGet(
        'trade/shares/all', token
    );
};
export const getAllTrades = async (token: string) => {
    return await SendGet(
        'trade/trades/all', token
    );
};
export const getShareTrades = async (id: string, token: string) => {
    return await SendGet(
        'trade/trades/id/'+id, token
    );
};