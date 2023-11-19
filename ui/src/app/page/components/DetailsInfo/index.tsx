import { Col, Row } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import "./index.scss";

interface IDetailsItem {
  label: string | JSX.Element;
  value: string | JSX.Element;
}

interface IDetailsInfoProps {
  title?: string;
  items: IDetailsItem[];
}

const DetailsInfo = (props: IDetailsInfoProps) => {
  const renderItemTitleValue = (item: IDetailsItem) => {
    return (
      <Row className="details-item">
        <Text strong>{`${item.label}: `}</Text>
        <Text>{item.value}</Text>
      </Row>
    );
  };

  return (
    <Col className="details-container">
      <Text strong>{props?.title || "--"}</Text>

      <Col className="details-content">
        {props.items.map((item) => renderItemTitleValue(item))}
      </Col>
    </Col>
  );
};

export default DetailsInfo;
