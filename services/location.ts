import { fetchApi } from "@/lib/api";
import { Division } from "@/types/location";

export async function getProvinces() {
  return fetchApi<Division[]>("/locations/provinces");
}

export async function getDistricts(provinceCode: number) {
  return fetchApi<Division[]>(`/locations/districts/${provinceCode}`);
}

export async function getWards(districtCode: number) {
  return fetchApi<Division[]>(`/locations/wards/${districtCode}`);
}
