import { List, Avatar } from "antd";
import { IPortfolioShare, IShare } from "../../../reducer";
import { timeAgoFromString } from "../../../utils/globalFuncs";
import shareImage from "../../../images/share.png";
import './PortfolioShares.css';
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../../../utils/websocket-provider";
interface PortfolioShareProps {
    portfolioShare: IPortfolioShare;
}
const PortfolioShare: React.FC<PortfolioShareProps> = (props) => {
    const { share, quantity, updatedAt } = props.portfolioShare;
    const [ sharePrice, setSharePrice] = useState(share.price);
    const { socket } = useContext(WebsocketContext);
    useEffect(() => {
        if (!socket) {
            return
          }
          const startShareListener = (data: IShare[]) => {
            const newShare = data.find(dataShare => dataShare.id === share.id);
            if (newShare) {
                setSharePrice(newShare.price);
            }
          }
          socket.on('shares', startShareListener);
          
    return () => {
        socket.off('shares');
      }
    }, [PortfolioShare]);
    return <List.Item
        actions={[
            <a key="list-loadmore-edit" href={"/share?symbol="+share.symbol} >buy</a>,
            <a key="list-loadmore-more" href={"/share?symbol="+share.symbol} >sell</a>,
        ]}
    >
        <List.Item.Meta
            avatar={<Avatar src={shareImage} />}
            title={<div className="shareTitle"><div className="symobl">{share.symbol}</div><div className="price">{sharePrice}$</div></div>}
            description={"Total Quantity: " + quantity + "| "+ timeAgoFromString(updatedAt)}
        />
        <div className="portfolioShareContent">
        {(quantity*sharePrice).toFixed(2)}$
        </div>
    </List.Item>
}
export default PortfolioShare;