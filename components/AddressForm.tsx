"use client";

import { useEffect, useState } from "react";
import { Division } from "../types/location";
import { getProvinces, getWards } from "@/services/location";
import LocationSelect from "@/components/LocationSelect";

type AddressFormProps = {
  setAddress: (address: { street: string; city: string; ward: string }) => void;
};

export default function AddressForm({ setAddress }: AddressFormProps) {
  const [provinces, setProvinces] = useState<Division[]>([]);
  const [wards, setWards] = useState<Division[]>([]);

  const [street, setStreet] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getProvinces();

        const HCM = data.find((p) => p.name === "Thành phố Hồ Chí Minh");
        if (HCM) {
          setProvinces([
            HCM,
            ...data.filter((p) => p.name !== "Thành phố Hồ Chí Minh"),
          ]);
        } else {
          setProvinces(data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!provinceName) return;

    async function loadWards() {
      const province = provinces.find((p) => p.name === provinceName);
      if (!province) {
        return;
      }

      const data = await getWards(province.code);
      setWards(data);
    }

    loadWards();
  }, [provinceName, provinces]);

  useEffect(() => {
    setAddress({
      street,
      city: provinceName,
      ward: wardName,
    });
  }, [setAddress, street, provinceName, wardName]);

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Tên đường / Số nhà
        </label>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full rounded border px-3 py-2 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Tỉnh / Thành phố
        </label>

        <LocationSelect
          placeholder="Chọn tỉnh / thành phố"
          list={provinces}
          divisionName={provinceName}
          onChange={(name) => {
            setProvinceName(name);

            setWardName("");
            setWards([]);
          }}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Phường / Xã</label>

        <LocationSelect
          placeholder="Chọn phường / xã"
          list={wards}
          divisionName={wardName}
          onChange={(name) => {
            setWardName(name);
          }}
        />
      </div>
    </>
  );
}
