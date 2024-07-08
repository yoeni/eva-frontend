import { Avatar, List } from "antd";
import { IShare } from "../../../reducer"
import shareImage from "../../../images/share.png";
import './shareComponent.css';
interface ShareProps {
    share: IShare;

}
const shareComponent: React.FC<ShareProps> = (props) => {
    const { symbol, price } = props.share;
    return <List.Item
                actions={[
                <a key="list-loadmore-edit" href={"/share?symbol="+symbol} >buy</a>,
                <a key="list-loadmore-more" href={"/share?symbol="+symbol} >sell</a>,
                ]}
            >
                <List.Item.Meta
                    avatar={<Avatar src={shareImage} />}
                    title={<div className="shareTitle"><div className="symobl">{symbol}</div></div>}
                    description={<div style={{ color: '#1677ff'}}>{price + '$'}</div>}
                />
            </List.Item>
}
export default shareComponent;