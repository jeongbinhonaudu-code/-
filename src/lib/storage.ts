"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 브라우저 localStorage 기반 영속화 훅.
 * 백엔드 DB 연동 전까지 사용자가 입력한 데이터(품질점검, 트레블러 등)가
 * 새로고침 후에도 유지되도록 한다. (요구사항 20번: 새로고침시 소실되는 시제품 금지)
 *
 * useSyncExternalStore를 사용해 localStorage(외부 저장소)를 안전하게 구독한다.
 * 서버 렌더링 시에는 seed를, 클라이언트에서는 실제 저장된 값을 반환해
 * effect 안에서 setState를 호출하는 방식보다 안전하게 하이드레이션을 처리한다.
 */
const cache = new Map<string, unknown[]>();
const listeners = new Map<string, Set<() => void>>();

function readFromStorage<T>(storageKey: string, seed: T[]): T[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T[]) : seed;
  } catch {
    return seed;
  }
}

function emitChange(storageKey: string) {
  listeners.get(storageKey)?.forEach((l) => l());
}

export function usePersistedList<T>(key: string, seed: T[]) {
  const storageKey = `factory-mgmt:${key}`;

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!listeners.has(storageKey)) listeners.set(storageKey, new Set());
      listeners.get(storageKey)!.add(callback);
      return () => listeners.get(storageKey)?.delete(callback);
    },
    [storageKey]
  );

  const getSnapshot = useCallback(() => {
    if (!cache.has(storageKey)) {
      cache.set(storageKey, readFromStorage(storageKey, seed));
    }
    return cache.get(storageKey) as T[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const getServerSnapshot = useCallback(() => seed, [seed]);

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const persist = useCallback(
    (next: T[]) => {
      cache.set(storageKey, next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // 저장 실패(용량 초과 등)는 조용히 무시하되 화면 상태는 유지
      }
      emitChange(storageKey);
    },
    [storageKey]
  );

  const add = useCallback(
    (item: T) => {
      persist([item, ...getSnapshot()]);
    },
    [getSnapshot, persist]
  );

  const update = useCallback(
    (predicate: (item: T) => boolean, updater: (item: T) => T) => {
      persist(getSnapshot().map((it) => (predicate(it) ? updater(it) : it)));
    },
    [getSnapshot, persist]
  );

  const remove = useCallback(
    (predicate: (item: T) => boolean) => {
      persist(getSnapshot().filter((it) => !predicate(it)));
    },
    [getSnapshot, persist]
  );

  const reset = useCallback(() => {
    persist(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  return { items, add, update, remove, reset, setItems: persist };
}
