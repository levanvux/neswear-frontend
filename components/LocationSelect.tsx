"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Division } from "@/types/location";

type LocationSelectProps = {
  placeholder: string;
  list: Division[];
  divisionName: string;
  onChange: (name: string) => void;
};

export default function LocationSelect({
  placeholder,
  list,
  divisionName,
  onChange,
}: LocationSelectProps) {
  // const selected =
  //   divisionName === "" ? null : list.find((div) => div.name === divisionName);

  return (
    <Combobox
      items={list}
      value={divisionName}
      onValueChange={(divisionName) => {
        onChange(divisionName ?? "");
      }}
    >
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>Không tìm thấy.</ComboboxEmpty>
        <ComboboxList>
          {(div) => (
            <ComboboxItem key={div.code} value={div.name}>
              {div.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
