import React, { useRef, useState } from "react";


const isHover = (draggedElm: HTMLElement, hoveredElm: HTMLElement): boolean => {
    const {top: dTop, bottom: dBottom} = draggedElm.getBoundingClientRect();
    const {top: hTop, bottom: hBottom} = hoveredElm.getBoundingClientRect();
    
    const hReferenceLine = (hTop + hBottom) / 2;

    return (
        hReferenceLine > dTop &&
        dBottom > hReferenceLine
    )
}





export type DnDItem = {
  key: number,
  value: string
}


type Position = {
  x: number,
  y: number
}

type DnDBlock = DnDItem & {
  position: Position,
  element: HTMLElement
}

type DnDInfoRef = {
  dndBlocks: DnDBlock[],
  canCheckHovered: boolean,
  cursorPosition: Position,
  draggedBlock: DnDBlock | null;
}



export type ReturnOfDnDSort = DnDItem & {
  events: {
    ref: (element: HTMLElement | null) => void;
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  };
}


export const useDnDSort = (defaultItems: DnDItem[]): ReturnOfDnDSort[] => {
  // 描画内容と紐づいているのでuseStateで管理する
  const [items, setItems] = useState(defaultItems);

  // 状態をrefで管理する
  const infoRef = useRef<DnDInfoRef>({
    dndBlocks: [],
    draggedBlock: null,
    canCheckHovered: true,
    cursorPosition: { x: 0, y: 0 }
  }).current;

  // ドラッグ中の処理
  const onMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { dndBlocks, draggedBlock, cursorPosition } = infoRef;

    // ドラッグして無ければ何もしない
    if (!draggedBlock) return;

    // マウスポインターの移動量を計算
    const x = clientX - cursorPosition.x;
    const y = clientY - cursorPosition.y;

    const draggedStyle = draggedBlock.element.style;

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
    const draggedIndex = dndBlocks.findIndex(({ key }) => key === draggedBlock.key);

    // ホバーされている要素の配列の位置を取得
    const hoveredIndex = dndBlocks.findIndex(
    //   ({ element }, index) => index !== dragIndex && isHover(event, element)
      ({ element: hoveredElement }, index) => index !== draggedIndex && isHover(draggedBlock.element, hoveredElement)
    );

    // ホバーされている要素があれば、ドラッグしている要素と入れ替える
    if (hoveredIndex !== -1) {
      // カーソルの位置を更新
      infoRef.cursorPosition.x = clientX;
      infoRef.cursorPosition.y = clientY;

      // 要素を入れ替える
      dndBlocks.splice(draggedIndex, 1);
      dndBlocks.splice(hoveredIndex, 0, draggedBlock);

      const { left: x, top: y } = draggedBlock.element.getBoundingClientRect();

      // ドラッグ要素の座標を更新
      draggedBlock.position = { x, y };

      const newItems: DnDItem[] = dndBlocks.map((block) => { return {key: block.key, value: block.value}}) 
      // 再描画する
      setItems(newItems)
      // setItems(dndItems.map((item) => { return {key: item.key, value: item.value}}));
    }
  };

  // ドラッグが終了した時の処理
  const onMouseUp = (event: MouseEvent) => {
    const { draggedBlock } = infoRef;

    // ドラッグしていなかったら何もしない
    if (!draggedBlock) return;

    const draggedStyle = draggedBlock.element.style;

    // ドラッグしてる要素に適用していたCSSを削除
    draggedStyle.zIndex = "";
    draggedStyle.cursor = "grab";
    draggedStyle.transform = "";

    // ドラッグしている要素をstateから削除
    infoRef.draggedBlock = null;

    // windowに登録していたイベントを削除
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  };

  return items.map(
    ({value,key}): ReturnOfDnDSort => {
      

      return {
        value,

        key,

        events: {
          ref: (element: HTMLElement | null) => {
            if (!element) return;

            const { dndBlocks, draggedBlock, cursorPosition } = infoRef;

            // 位置をリセットする
            element.style.transform = "";

            // 要素の位置を取得
            const { left: x, top: y } = element.getBoundingClientRect();
            const position: Position = { x, y };

            const itemIndex = dndBlocks.findIndex((block) => block.key === key);

            // 要素が無ければ新しく追加して処理を終わる
            if (itemIndex === -1) {
              return dndBlocks.push({ key, value, element, position });
            }

            // ドラッグ要素の時は、ズレを修正する
            if (draggedBlock?.key === key) {
              // ドラッグ要素のズレを計算する
              const dragX = draggedBlock.position.x - position.x;
              const dragY = draggedBlock.position.y - position.y;

              // 入れ替え時のズレを無くす
              element.style.transform = `translate(${dragX}px,${dragY}px)`;

              // マウスポインターの位置も再計算してズレを無くす
              cursorPosition.x -= dragX;
              cursorPosition.y -= dragY;
            }

            // ドラッグ要素以外の要素をアニメーションさせながら移動させる
            if (draggedBlock?.key !== key) {
              const item = dndBlocks[itemIndex];

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
            infoRef.dndBlocks[itemIndex] = { key, value, element, position };
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
            infoRef.draggedBlock = { key, value, element, position };

            // mousemove, mouseupイベントをwindowに登録する
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("mousemove", onMouseMove);
          }
        }
      };
    }
  );
};