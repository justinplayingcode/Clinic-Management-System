import { useState } from "react";
import AddressField from "../../components/AddressField";
import { Button } from "antd";

function Overview() {
  const inputAddress =
    "Thành phố Hà Nội*Quận Ba Đình*Phường Trúc Bạch*số nhà 12, đường Trường Chinh";
  const [address, setAddress] = useState<string>(inputAddress);
  return (
    <div>
      Overview
      <div style={{ width: "300px", backgroundColor: "#fff" }}>
        <AddressField value={address} onChange={(value) => setAddress(value)} />
        <Button onClick={() => console.log(address)}>Submit</Button>
      </div>
    </div>
  );
}

export default Overview;
