import { useState } from "react";
import { medicationApi } from "../../../api";
import Picker from "../components/picker";
import { IPersonaProps } from "@fluentui/react";

function Histories() {
  const [medication, setMedication] = useState<IPersonaProps[]>([]);
  return (
    <div>
      <Picker
        label={"Chuẩn đoán bệnh: "}
        onChangeCallBack={(value) => setMedication(value)}
        value={medication}
        integrateItems={medicationApi.pickerMedications}
        mappingValues={(datas) => {
          const values = datas.map((e: any) => {
            return {
              displayName: e.displayName,
              text: e.displayName,
              secondaryText: e.designation,
              id: e._id,
              usage: e.usage
            }
          })
          return values
        }}
        placeholder={"Nhập tên thuốc"}
      />
    </div>
  );
}

export default Histories;