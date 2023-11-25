import Picker from "../components/picker";

function Histories() {
  return (
    <div>
      <Picker
        label={"Chuẩn đoán bệnh: "}
        onChangeCallBack={(value) => {console.log(value)}}
        value={[]}
        integrateItems={() => Promise.resolve()}
        mappingValues={(datas) => {
          const values = datas.map((e: any) => {
            return {
              displayName: e.name,
              text: e.name,
              secondaryText: e.designation,
              id: e._id,
              usage: e.usage
            }
          })
          return values
        }}
        placeholder={"Nhập tên bệnh"}
      />
    </div>
  );
}

export default Histories;