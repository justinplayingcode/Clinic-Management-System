import { Input, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface IAddressFieldProps {
  value: string;
  onChange: (value: string) => void;
}

interface ISelectOption {
  value: string;
  label: string;
}

function AddressField(props: IAddressFieldProps) {
  const { value, onChange } = props;

  const defaultSelectOption: ISelectOption = {
    value: "",
    label: "",
  };

  const [city, setCity] = useState<ISelectOption>(defaultSelectOption);
  const [district, setDistrict] = useState<ISelectOption>(defaultSelectOption);
  const [commune, setCommune] = useState<ISelectOption>(defaultSelectOption);
  const [details, setDetails] = useState<string>("");

  const [cityList, setCityList] = useState<ISelectOption[]>([]);
  const [districtList, setDistrictList] = useState<ISelectOption[]>([]);
  const [communeList, setComuneList] = useState<ISelectOption[]>([]);

  const selectStyle = {
    width: "100%",
  };

  const host = "https://provinces.open-api.vn/api/";

  const callAPI = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setCityList(result || []);
    });
  };

  const callApiDistrict = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.districts?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setDistrictList(result || []);
    });
  };

  const callApiWard = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.wards?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setComuneList(result || []);
    });
  };
  useEffect(() => {
    callAPI(host);
    if (value) {
      const addressToList = value.split("*");
      if (addressToList.length) {
        setDetails(addressToList[3]);
      }
    }
  }, []);

  useEffect(() => {
    if (value && cityList.length > 0) {
      const cityName = value.split("*")[0];
      const currentCity = cityList.find((city) => city.label === cityName);
      if (currentCity) setCity(currentCity);
    }
  }, [cityList]);

  useEffect(() => {
    callApiDistrict(`${host}p/${city.value}?depth=2`);
  }, [city]);

  useEffect(() => {
    if (value && districtList.length > 0) {
      const districtName = value.split("*")[1];
      const currentDistrict = districtList.find(
        (district) => district.label === districtName
      );
      if (currentDistrict) setDistrict(currentDistrict);
    }
  }, [districtList]);

  useEffect(() => {
    callApiWard(`${host}d/${district.value}?depth=2`);
  }, [district]);

  useEffect(() => {
    if (value && communeList.length > 0) {
      const communeName = value.split("*")[2];
      const currentCommine = communeList.find(
        (commune) => commune.label === communeName
      );
      if (currentCommine) setCommune(currentCommine);
    }
  }, [communeList]);

  useEffect(() => {
    if (city.label && district.label && commune.label) {
      const address = `${city.label}*${district.label}*${commune.label}*${details}`;
      onChange(address || "");
    }
  }, [city, district, commune, details]);

  return (
    <>
      <Select
        labelInValue
        style={selectStyle}
        placeholder="Chọn Tỉnh/Thành phố"
        options={cityList}
        value={city}
        onChange={(value: { value: string; label: string }) => {
          setCity({
            value: value.value,
            label: value.label,
          });

          // reset district, commune, details value
          setDistrict(defaultSelectOption);
          setCommune(defaultSelectOption);
        }}
      ></Select>
      <Select
        labelInValue
        style={selectStyle}
        placeholder="Chọn Quận/Huyện"
        options={districtList}
        value={district}
        onChange={(value: { value: string; label: string }) => {
          setDistrict({
            value: value.value,
            label: value.label,
          });

          // reset commune, details value
          setCommune(defaultSelectOption);
        }}
        disabled={!city.label}
      ></Select>
      <Select
        labelInValue
        style={selectStyle}
        placeholder="Chọn Phường/Xã"
        options={communeList}
        value={commune}
        onChange={(value: { value: string; label: string }) => {
          setCommune({
            value: value.value,
            label: value.label,
          });
        }}
        disabled={!district.label}
      ></Select>
      <Input
        placeholder="Nhập địa chỉ"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        disabled={!commune.label}
      />
    </>
  );
}

export default AddressField;
