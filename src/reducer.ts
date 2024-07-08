export interface IUser {
    id: string;
    name: string;
    username: string;
    email: string;
}
export interface IShare {
    id: string;
    symbol: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}
export interface IPortfolioShare {
    id: string;
    portfolioId: string;
    shareId: string;
    quantity: number;
    share: IShare;
    createdAt: string;
    updatedAt: string;

}
export interface IPortfolio {
    id: string;
    userId:string;
    createdAt: string;
    updatedAt: string;
    portfolioShares: IPortfolioShare[];
}
export enum TradeType {
    buy = 1,
    sell = 0
}
export interface ITrade {
    id: string;
    portfolioId: string;
    tradeType: TradeType;
    quantity: number;
    tradePrice: number;
    tradeTime: string;
    shareId: string;
    share: IShare;
}

export interface IState {
    user: IUser | undefined;
    portfolio: IPortfolio | undefined;
}
const initalState: IState ={
    user: undefined,
    portfolio: undefined,
}
export const Reducer = (state = initalState, action: any): IState => {
    switch (action.type) {
        case 'setUser':
            return { ...state, user: action.payload };
        case 'setPortfolio':
            return { ...state, portfolio: action.payload };
        default:
            return state;
    }
};

