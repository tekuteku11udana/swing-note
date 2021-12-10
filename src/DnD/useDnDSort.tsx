import React, { useRef, useState } from "react";

/**
 * @description マウスポインターが要素と被っているか判定します
 */


const isHover = (draggedElm: HTMLElement, hoveredElm: HTMLElement): boolean => {
    const {top: dTop, bottom: dBottom} = draggedElm.getBoundingClientRect();
    const {top: hTop, bottom: hBottom} = hoveredElm.getBoundingClientRect();
    
    const hReferenceLine = (hTop + hBottom) / 2;

    return (
        hReferenceLine > dTop &&
        dBottom > hReferenceLine
    )
}



// // ドラッグ＆ドロップ要素の情報をまとめた型
// interface DnDItem<T> {
//   value: T; // useDnDSort()の引数に渡された配列の要素の値
//   key: string; // 要素と紐づいた一意な文字列
//   position: Position; // 要素の座標
//   element: HTMLElement; // DOM情報
// }


// useRef()で保持するデータの型
// interface DnDRef<T> {
//   keys: Map<T, string>; // 要素に紐づいたkey文字列を管理するMap
//   dndItems: DnDItem<T>[]; // 並び替える全ての要素を保持するための配列
//   canCheckHovered: boolean; // 重なり判定ができるかのフラグ
//   pointerPosition: Position; // マウスポインターの座標
//   dragElement: DnDItem<T> | null; // ドラッグしてる要素
// }

export type ParamOfDnDSort = {
  key: number,
  value: string
}

// 座標の型
type Position = {
  x: number,
  y: number
}

type DnDItem = ParamOfDnDSort & {
  position: Position,
  element: HTMLElement
}

type DnDInfoRef = {
  dndItems: DnDItem[],
  canCheckHovered: boolean,
  cursorPosition: Position,
  draggedItem: DnDItem | null;
}



export type ReturnOfDnDSort = ParamOfDnDSort & {
  events: {
    ref: (element: HTMLElement | null) => void;
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  };
}

// // 返り値の型
// export interface DnDSortResult<T> {
//   key: string;
//   value: T;
//   events: {
//     ref: (element: HTMLElement | null) => void;
//     onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
//   };
// }

/**
 * @description ドラッグ＆ドロップの並び替え処理を提供します
 */
export const useDnDSort = (defaultItems: ParamOfDnDSort[]): ReturnOfDnDSort[] => {
  // 描画内容と紐づいているのでuseStateで管理する
  const [items, setItems] = useState(defaultItems);

  // 状態をrefで管理する
  const infoRef = useRef<DnDInfoRef>({
    dndItems: [],
    draggedItem: null,
    canCheckHovered: true,
    cursorPosition: { x: 0, y: 0 }
  }).current;

  // ドラッグ中の処理
  const onMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { dndItems, draggedItem, cursorPosition } = infoRef;

    // ドラッグして無ければ何もしない
    if (!draggedItem) return;

    // マウスポインターの移動量を計算
    const x = clientX - cursorPosition.x;
    const y = clientY - cursorPosition.y;

    const draggedStyle = draggedItem.element.style;

    // ドラッグ要素の座標とスタイルを更新
    draggedStyle.zIndex = "100";
    draggedStyle.cursor = "grabbing";
    draggedStyle.transform = `translate(${x}px,${y}px)`;

    // まだ確認できない場合は処理を終了する
    if (!infoRef.canCheckHovered) return;

    // 確認できないようにする
    infoRef.canCheckHovered = false;

    // 300ms後に確認できるようにする
    setTimeout(() => (infoRef.canCheckHovered = true), 300);

    // ドラッグしている要素の配列の位置を取得
    const draggedIndex = dndItems.findIndex(({ key }) => key === draggedItem.key);

    // ホバーされている要素の配列の位置を取得
    const hoveredIndex = dndItems.findIndex(
    //   ({ element }, index) => index !== dragIndex && isHover(event, element)
      ({ element: hoveredElement }, index) => index !== draggedIndex && isHover(draggedItem.element, hoveredElement)
    );

    // ホバーされている要素があれば、ドラッグしている要素と入れ替える
    if (hoveredIndex !== -1) {
      // カーソルの位置を更新
      infoRef.cursorPosition.x = clientX;
      infoRef.cursorPosition.y = clientY;

      // 要素を入れ替える
      dndItems.splice(draggedIndex, 1);
      dndItems.splice(hoveredIndex, 0, draggedItem);

      const { left: x, top: y } = draggedItem.element.getBoundingClientRect();

      // ドラッグ要素の座標を更新
      draggedItem.position = { x, y };

      const newItems: ParamOfDnDSort[] = dndItems.map((item) => { return {key: item.key, value: item.value}}) 
      // 再描画する
      setItems(newItems)
      // setItems(dndItems.map((item) => { return {key: item.key, value: item.value}}));
    }
  };

  // ドラッグが終了した時の処理
  const onMouseUp = (event: MouseEvent) => {
    const { draggedItem } = infoRef;

    // ドラッグしていなかったら何もしない
    if (!draggedItem) return;

    const draggedStyle = draggedItem.element.style;

    // ドラッグしてる要素に適用していたCSSを削除
    draggedStyle.zIndex = "";
    draggedStyle.cursor = "";
    draggedStyle.transform = "";

    // ドラッグしている要素をstateから削除
    infoRef.draggedItem = null;

    // windowに登録していたイベントを削除
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  };

  return items.map(
    ({value,key}): ReturnOfDnDSort => {
      // // keyが無ければ新しく作り、あれば既存のkey文字列を返す
      // const key = infoRef.keys.get(value) || Math.random().toString(16);

      // // 生成したkey文字列を保存
      // state.keys.set(value, key);


      return {
        value,

        key,

        events: {
          ref: (element: HTMLElement | null) => {
            if (!element) return;

            const { dndItems, draggedItem, cursorPosition } = infoRef;

            // 位置をリセットする
            element.style.transform = "";

            // 要素の位置を取得
            const { left: x, top: y } = element.getBoundingClientRect();
            const position: Position = { x, y };

            const itemIndex = dndItems.findIndex((item) => item.key === key);

            // 要素が無ければ新しく追加して処理を終わる
            if (itemIndex === -1) {
              return dndItems.push({ key, value, element, position });
            }

            // ドラッグ要素の時は、ズレを修正する
            if (draggedItem?.key === key) {
              // ドラッグ要素のズレを計算する
              const dragX = draggedItem.position.x - position.x;
              const dragY = draggedItem.position.y - position.y;

              // 入れ替え時のズレを無くす
              element.style.transform = `translate(${dragX}px,${dragY}px)`;

              // マウスポインターの位置も再計算してズレを無くす
              cursorPosition.x -= dragX;
              cursorPosition.y -= dragY;
            }

            // ドラッグ要素以外の要素をアニメーションさせながら移動させる
            if (draggedItem?.key !== key) {
              const item = dndItems[itemIndex];

              // 前回の座標を計算
              const x = item.position.x - position.x;
              const y = item.position.y - position.y;

              // 要素を前回の位置に留めておく
              element.style.transition = "";
              element.style.transform = `translate(${x}px,${y}px)`;

              // 一フレーム後に要素をアニメーションさせながら元に位置に戻す
              requestAnimationFrame(() => {
                element.style.transform = "";
                element.style.transition = "all 300ms";
              });
            }

            // 要素を更新する
            infoRef.dndItems[itemIndex] = { key, value, element, position };
          },

          onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
            // ドラッグする要素(DOM)
            const element = event.currentTarget;

            // マウスポインターの座標を保持しておく
            infoRef.cursorPosition.x = event.clientX;
            infoRef.cursorPosition.y = event.clientY;

            // ドラッグしている要素のスタイルを上書き
            element.style.transition = ""; // アニメーションを無効にする
            element.style.cursor = "grabbing"; // カーソルのデザインを変更

            // 要素の座標を取得
            const { left: x, top: y } = element.getBoundingClientRect();
            const position: Position = { x, y };

            // ドラッグする要素を保持しておく
            infoRef.draggedItem = { key, value, element, position };

            // mousemove, mouseupイベントをwindowに登録する
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("mousemove", onMouseMove);
          }
        }
      };
    }
  );
};