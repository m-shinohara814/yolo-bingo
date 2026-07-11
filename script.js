const STORAGE_KEYS = {
  bingoHistory: "yoloBingoHistory",
  openedGifts: "yoloOpenedGifts"
};


/*
  画像ファイル名

  ラッピング画像
  wrapped-1.png
  wrapped-2.png
  wrapped-3.png
  wrapped-4.png
  wrapped-5.png
  wrapped-6.png
  wrapped-7.png
  wrapped-8.png

  中身の画像
  prize-1.png
  prize-2.png
  prize-3.png
  prize-4.png
  prize-5.png
  prize-6.png
  prize-7.png
  prize-8.png
*/

const gifts = [
  {
    id: 1,
    name: "プレゼント 1",
    wrappedImage: "images/wrapped-1.png",
    prizeImage: "images/prize-1.png"
  },
  {
    id: 2,
    name: "プレゼント 2",
    wrappedImage: "images/wrapped-2.png",
    prizeImage: "images/prize-2.png"
  },
  {
    id: 3,
    name: "プレゼント 3",
    wrappedImage: "images/wrapped-3.png",
    prizeImage: "images/prize-3.png"
  },
  {
    id: 4,
    name: "プレゼント 4",
    wrappedImage: "images/wrapped-4.png",
    prizeImage: "images/prize-4.png"
  },
  {
    id: 5,
    name: "プレゼント 5",
    wrappedImage: "images/wrapped-5.png",
    prizeImage: "images/prize-5.png"
  },
  {
    id: 6,
    name: "プレゼント 6",
    wrappedImage: "images/wrapped-6.png",
    prizeImage: "images/prize-6.png"
  },
  {
    id: 7,
    name: "プレゼント 7",
    wrappedImage: "images/wrapped-7.png",
    prizeImage: "images/prize-7.png"
  },
  {
    id: 8,
    name: "プレゼント 8",
    wrappedImage: "images/wrapped-8.png",
    prizeImage: "images/prize-8.png"
  }
];


const giftGrid =
  document.getElementById("giftGrid");

const currentNumber =
  document.getElementById("currentNumber");

const drawButton =
  document.getElementById("drawButton");

const historyNumbers =
  document.getElementById("historyNumbers");

const remainingCount =
  document.getElementById("remainingCount");

const resetBingoButton =
  document.getElementById("resetBingoButton");

const resetGiftsButton =
  document.getElementById("resetGiftsButton");

const giftModal =
  document.getElementById("giftModal");

const modalImage =
  document.getElementById("modalImage");

const modalTitle =
  document.getElementById("modalTitle");

const closeModalButton =
  document.getElementById("closeModalButton");


let history =
  loadArray(STORAGE_KEYS.bingoHistory);

let openedGifts =
  loadArray(STORAGE_KEYS.openedGifts);

let isDrawing = false;


/* =========================
   ローカル保存読み込み
========================= */

function loadArray(key) {

  try {

    const savedValue =
      localStorage.getItem(key);

    const parsedValue =
      JSON.parse(savedValue);

    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }

    return [];

  } catch (error) {

    console.error(
      "保存データの読み込みに失敗しました。",
      error
    );

    return [];

  }

}


/* =========================
   ローカル保存
========================= */

function saveState() {

  localStorage.setItem(
    STORAGE_KEYS.bingoHistory,
    JSON.stringify(history)
  );

  localStorage.setItem(
    STORAGE_KEYS.openedGifts,
    JSON.stringify(openedGifts)
  );

}


/* =========================
   画像がない場合の仮画像
========================= */

function createFallbackDataUrl(
  text,
  backgroundColor = "#f3d9e5"
) {

  const safeText =
    String(text)
      .replace(/[<>&"]/g, "");

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="520"
    >

      <rect
        width="100%"
        height="100%"
        fill="${backgroundColor}"
      />

      <circle
        cx="400"
        cy="190"
        r="95"
        fill="#ffffff"
        opacity="0.72"
      />

      <text
        x="400"
        y="218"
        text-anchor="middle"
        font-size="100"
      >
        🎁
      </text>

      <text
        x="400"
        y="365"
        text-anchor="middle"
        font-family="sans-serif"
        font-size="42"
        font-weight="700"
        fill="#4a3440"
      >
        ${safeText}
      </text>

    </svg>
  `;

  return (
    "data:image/svg+xml;charset=UTF-8,"
    + encodeURIComponent(svg)
  );

}


function setImageFallback(
  imageElement,
  label,
  color
) {

  imageElement.addEventListener(
    "error",
    function () {

      imageElement.src =
        createFallbackDataUrl(
          label,
          color
        );

    },
    {
      once: true
    }
  );

}


/* =========================
   景品画像を表示
========================= */

function renderGifts() {

  giftGrid.innerHTML = "";

  gifts.forEach(function (gift) {

    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "gift-card";

    button.setAttribute(
      "aria-label",
      gift.name + "を開く"
    );


    if (
      openedGifts.includes(gift.id)
    ) {
      button.classList.add(
        "is-opened"
      );
    }


    const image =
      document.createElement("img");

    image.src =
      gift.wrappedImage;

    image.alt =
      gift.name + "のラッピング";


    setImageFallback(
      image,
      "WRAPPED " + gift.id,
      "#f7d7e5"
    );


    const label =
      document.createElement("span");

    label.className =
      "gift-card-label";

    label.textContent =
      "No. " + gift.id;


    button.append(
      image,
      label
    );


    button.addEventListener(
      "click",
      function () {

        openGift(gift);

      }
    );


    giftGrid.appendChild(
      button
    );

  });

}


/* =========================
   景品を開く
========================= */

function openGift(gift) {

  modalImage.src =
    gift.prizeImage;

  modalImage.alt =
    gift.name + "の中身";


  setImageFallback(
    modalImage,
    "PRIZE " + gift.id,
    "#fff0b8"
  );


  modalTitle.textContent =
    gift.name;


  giftModal.classList.add(
    "is-open"
  );

  giftModal.setAttribute(
    "aria-hidden",
    "false"
  );


  if (
    !openedGifts.includes(gift.id)
  ) {

    openedGifts.push(gift.id);

    saveState();

    renderGifts();

  }

}


/* =========================
   景品画面を閉じる
========================= */

function closeGiftModal() {

  giftModal.classList.remove(
    "is-open"
  );

  giftModal.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================
   ビンゴ画面更新
========================= */

function renderBingo() {

  const latestNumber =
    history.length > 0
      ? history[history.length - 1]
      : null;


  currentNumber.textContent =
    latestNumber ?? "?";


  remainingCount.textContent =
    "残り "
    + (75 - history.length)
    + " 個";


  historyNumbers.innerHTML = "";


  if (history.length === 0) {

    const emptyMessage =
      document.createElement("span");

    emptyMessage.className =
      "history-empty";

    emptyMessage.textContent =
      "まだ数字は出ていません";

    historyNumbers.appendChild(
      emptyMessage
    );

  } else {

    history.forEach(
      function (number, index) {

        const numberElement =
          document.createElement("span");

        numberElement.className =
          "history-number";


        if (
          index === history.length - 1
        ) {

          numberElement.classList.add(
            "latest"
          );

        }


        numberElement.textContent =
          number;


        historyNumbers.appendChild(
          numberElement
        );

      }
    );

  }


  drawButton.disabled =
    history.length >= 75
    || isDrawing;


  if (history.length >= 75) {

    drawButton.textContent =
      "FINISH";

  } else {

    drawButton.textContent =
      "START";

  }

}


/* =========================
   まだ出ていない数字を取得
========================= */

function getRemainingNumbers() {

  const usedNumbers =
    new Set(history);


  return Array
    .from(
      {
        length: 75
      },
      function (_, index) {

        return index + 1;

      }
    )
    .filter(
      function (number) {

        return !usedNumbers.has(number);

      }
    );

}


/* =========================
   配列からランダムに選ぶ
========================= */

function randomItem(items) {

  const randomIndex =
    Math.floor(
      Math.random()
      * items.length
    );

  return items[randomIndex];

}


/* =========================
   ビンゴ抽選
========================= */

async function drawNumber() {

  if (isDrawing) {
    return;
  }


  const remainingNumbers =
    getRemainingNumbers();


  if (
    remainingNumbers.length === 0
  ) {

    alert(
      "1〜75の数字がすべて出ました！"
    );

    return;

  }


  isDrawing = true;

  drawButton.disabled = true;

  currentNumber.classList.add(
    "is-drawing"
  );


  const animationDuration =
    1500;

  const intervalTime =
    75;

  const startTime =
    Date.now();


  await new Promise(
    function (resolve) {

      const timer =
        setInterval(
          function () {

            currentNumber.textContent =
              randomItem(
                remainingNumbers
              );


            const elapsedTime =
              Date.now()
              - startTime;


            if (
              elapsedTime
              >= animationDuration
            ) {

              clearInterval(timer);

              resolve();

            }

          },
          intervalTime
        );

    }
  );


  const selectedNumber =
    randomItem(
      remainingNumbers
    );


  history.push(
    selectedNumber
  );


  saveState();


  isDrawing = false;


  currentNumber.classList.remove(
    "is-drawing"
  );


  renderBingo();

}


/* =========================
   ビンゴをリセット
========================= */

function resetBingo() {

  const shouldReset =
    window.confirm(
      "出た数字をすべて消して、ビンゴを最初からやり直しますか？"
    );


  if (!shouldReset) {
    return;
  }


  history = [];


  saveState();

  renderBingo();

}


/* =========================
   景品の開封状態をリセット
========================= */

function resetGifts() {

  const shouldReset =
    window.confirm(
      "開封済みの表示をすべて元に戻しますか？"
    );


  if (!shouldReset) {
    return;
  }


  openedGifts = [];


  saveState();

  renderGifts();

}


/* =========================
   ボタン操作
========================= */

drawButton.addEventListener(
  "click",
  drawNumber
);


resetBingoButton.addEventListener(
  "click",
  resetBingo
);


resetGiftsButton.addEventListener(
  "click",
  resetGifts
);


closeModalButton.addEventListener(
  "click",
  closeGiftModal
);


/* 黒い背景を押したとき閉じる */

giftModal.addEventListener(
  "click",
  function (event) {

    if (
      event.target.matches(
        "[data-close-modal]"
      )
    ) {

      closeGiftModal();

    }

  }
);


/* =========================
   キーボード操作
========================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeGiftModal();

    }


    const modalIsOpen =
      giftModal.classList.contains(
        "is-open"
      );


    if (
      (
        event.key === "Enter"
        || event.code === "Space"
      )
      && !modalIsOpen
    ) {

      event.preventDefault();

      drawNumber();

    }

  }
);


/* =========================
   最初の表示
========================= */

renderGifts();

renderBingo();
