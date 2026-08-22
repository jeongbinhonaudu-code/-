"use client";

import { useCallback } from "react";
import { Equipment, EquipmentOverride } from "@/types";
import { equipmentList } from "@/data/equipment";
import { usePersistedList } from "@/lib/storage";

const EMPTY_OVERRIDES: EquipmentOverride[] = [];

/** 기준 설비 데이터 위에 생산팀이 입력한 최신 상태(overrides)를 덮어써 실제 화면에 쓸 설비 목록을 만든다. */
export function mergeEquipment(overrides: EquipmentOverride[]): Equipment[] {
  const byId = new Map(overrides.map((o) => [o.equipmentId, o]));
  return equipmentList.map((eq) => {
    const o = byId.get(eq.id);
    if (!o) return eq;
    return {
      ...eq,
      status: o.status,
      currentProduct: o.currentProduct,
      currentTravelerNo: o.currentTravelerNo,
      currentQuantity: o.currentQuantity,
      quantityReliability: "confirmed",
    };
  });
}

export function getByZone(list: Equipment[], zoneId: string): Equipment[] {
  return list.filter((e) => e.zoneId === zoneId);
}

export function getZoneStatus(list: Equipment[], zoneId: string): Equipment["status"] {
  const items = getByZone(list, zoneId);
  if (items.length === 0) return "neutral";
  if (items.some((e) => e.status === "nonconforming")) return "nonconforming";
  if (items.some((e) => e.status === "quality_check")) return "quality_check";
  if (items.some((e) => e.status === "running")) return "running";
  if (items.every((e) => e.status === "waiting")) return "waiting";
  return "neutral";
}

export function useEffectiveEquipment() {
  const { items: overrides, update, add } = usePersistedList<EquipmentOverride>("equipment-overrides", EMPTY_OVERRIDES);
  const equipment = mergeEquipment(overrides);

  const updateEquipment = useCallback(
    (equipmentId: string, patch: Omit<EquipmentOverride, "equipmentId">) => {
      const exists = overrides.some((o) => o.equipmentId === equipmentId);
      if (exists) {
        update((o) => o.equipmentId === equipmentId, () => ({ equipmentId, ...patch }));
      } else {
        add({ equipmentId, ...patch });
      }
    },
    [overrides, update, add]
  );

  return { equipment, overrides, updateEquipment };
}
