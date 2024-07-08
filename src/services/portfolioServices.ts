import { SendGet, SendPost } from "../utils/request";

export const getUserPortfolio = async (id: string, token: string) => {
    return await SendGet(
        'portfolio/id/'+id, token
    );
};

export const getPortfoliioTrades = async (id: string, token: string) => {
    return await SendGet(
        'portfolio/trades/'+id, token
    );
};

export const makeTrade= async (portfolioId: string, shareId: string, tradeType: number, quantity: number, tradePrice: number, token: string) => {
    return await SendPost(
        'portfolio/trade',{
            portfolioId,
            shareId,
            tradeType,
            quantity,
            tradePrice,
        },
        token
    );
};