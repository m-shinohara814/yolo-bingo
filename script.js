const STORAGE_KEYS = {
  bingoHistory: "yoloBingoHistory",
  openedGifts: "yoloOpenedGifts"
};


/*
  使用するファイル

  ラッピング画像
  images/wrapped-1.png
  images/wrapped-2.png
  images/wrapped-3.png
  images/wrapped-4.png
  images/wrapped-5.png
  images/wrapped-6.png
  images/wrapped-7.png
  images/wrapped-8.png

  景品画像
  images/prize-1.png
  images/prize-2.png
  images/prize-3.png
  images/prize-4.png
  images/prize-5.png
  images/prize-6.png
  images/prize-7.png
  images/prize-8.png

  ビンゴ効果音
  audio/bingo-sound.mp3
*/


const gifts = [
  {
    id: 1,
    name: "つなげーとポイント",
    wrappedImage: "images/wrapped-1.png",
    prizeImage: "images/prize-1.png"
  },
  {
    id: 2,
    name: "YOLOタンブラー",
    wrappedImage: "images/wrapped-2.png",
    prizeImage: "images/prize-2.png"
  },
  {
    id: 3,
    name: "YOLO米",
    wrappedImage: "images/wrapped-3.png",
    prizeImage: "images/prize-3.png"
  },
  {
    id: 4,
    name: "Amazonギフト券",
    wrappedImage: "images/wrapped-4.png",
    prizeImage: "images/prize-4.png"
  },
  {
    id: 5,
    name: "凍らせて食べるシャーベット",
    wrappedImage: "images/wrapped-5.png",
    prizeImage: "images/prize-5.png"
  },
  {
    id: 6,
    name: "ご当地ラーメンセット",
    wrappedImage: "images/wrapped-6.png",
    prizeImage: "images/prize-6.png"
  },
  {
    id: 7,
    name: "今では関西でしか買えないカール",
    wrappedImage: "images/wrapped-7.png",
    prizeImage: "images/prize-7.png"
  },
  {
    id: 8,
    name: "駄菓子詰め合わせセット",
    wrappedImage: "images/wrapped-8.png",
    prizeImage: "images/prize-8.png"
  }
];


/*
  音源の最後に入っているポップ音が鳴るタイミングです。

  例：
  ポップ音が3秒後なら 3000
  ポップ音が4.5秒後なら 4500
*/
const DRAW_DURATION_MS = 3000;


/* =========================
   HTML要素
========================= */

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


/* =========================
   保存データ
========================= */

let history =
  loadArray(STORAGE_KEYS.bingoHistory);

let openedGifts =
  loadArray(STORAGE_KEYS.openedGifts);

let isDrawing = false;


/* =========================
   ビンゴ効果音
========================= */

const bingoAudio =
  new Audio("audio/bingo-sound.mp3");

bingoAudio.preload = "auto";
bingoAudio.volume = 1;


/*
  STARTを押したら音源を最初から再生します。
  音源にはドラムロールと決定音の両方が入っています。
*/

async function playBingoSound() {

  bingoAudio.pause();
  bingoAudio.currentTime = 0;

  try {

    await bingoAudio.play();

  } catch (error) {

    /*
      音声再生に失敗しても、
      ビンゴ抽選自体は止めません。
    */

    console.error(
      "ビンゴ効果音を再生できませんでした。",
      error
    );

  }

}


/* =========================
   数字決定アニメーション
========================= */

function animateCurrentNumber() {

  currentNumber.classList.remove(
    "number-pop"
  );

  /*
    同じアニメーションを
    毎回再生するために必要
  */

  void currentNumber.offsetWidth;

  currentNumber.classList.add(
    "number-pop"
  );

  setTimeout(
    function () {

      currentNumber.classList.remove(
        "number-pop"
      );

    },
    750
  );

}


/* =========================
   紙吹雪
========================= */

function launchConfetti() {

  const canvas =
    document.createElement("canvas");

  canvas.className =
    "confetti-canvas";

  document.body.appendChild(
    canvas
  );


  const context =
    canvas.getContext("2d");

  if (!context) {
    canvas.remove();
    return;
  }


  const devicePixelRatio =
    window.devicePixelRatio || 1;


  canvas.width =
    window.innerWidth
    * devicePixelRatio;

  canvas.height =
    window.innerHeight
    * devicePixelRatio;

  canvas.style.width =
    window.innerWidth + "px";

  canvas.style.height =
    window.innerHeight + "px";


  context.scale(
    devicePixelRatio,
    devicePixelRatio
  );


  const colors = [
    "#ff4f8b",
    "#ffd94a",
    "#4fc3f7",
    "#7bd389",
    "#9c6ade",
    "#ff8a4c"
  ];


  const particles =
    Array.from(
      {
        length: 180
      },
      function () {

        return {
          x:
            window.innerWidth / 2,

          y:
            window.innerHeight * 0.45,

          size:
            Math.random() * 8 + 5,

          speedX:
            Math.random() * 14 - 7,

          speedY:
            Math.random() * -13 - 5,

          gravity:
            Math.random() * 0.15 + 0.18,

          rotation:
            Math.random()
            * Math.PI
            * 2,

          rotationSpeed:
            Math.random() * 0.3 - 0.15,

          color:
            colors[
              Math.floor(
                Math.random()
                * colors.length
              )
            ],

          opacity: 1
        };

      }
    );


  const startTime =
    performance.now();


  function drawConfetti(currentTime) {

    context.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );


    particles.forEach(
      function (particle) {

        particle.x +=
          particle.speedX;

        particle.y +=
          particle.speedY;

        particle.speedY +=
          particle.gravity;

        particle.rotation +=
          particle.rotationSpeed;


        const elapsedTime =
          currentTime - startTime;


        if (elapsedTime > 1800) {

          particle.opacity -=
            0.025;

        }


        context.save();

        context.globalAlpha =
          Math.max(
            particle.opacity,
            0
          );

        context.translate(
          particle.x,
          particle.y
        );

        context.rotate(
          particle.rotation
        );

        context.fillStyle =
          particle.color;

        context.fillRect(
          -particle.size / 2,
          -particle.size / 3,
          particle.size,
          particle.size * 0.65
        );

        context.restore();

      }
    );


    const stillVisible =
      particles.some(
        function (particle) {

          return (
            particle.opacity > 0
            && particle.y
              < window.innerHeight + 50
          );

        }
      );


    if (
      currentTime - startTime < 3500
      && stillVisible
    ) {

      requestAnimationFrame(
        drawConfetti
      );

    } else {

      canvas.remove();

    }

  }


  requestAnimationFrame(
    drawConfetti
  );

}


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


  gifts.forEach(
    function (gift) {

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

    }
  );

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


  launchConfetti();


  if (
    !openedGifts.includes(gift.id)
  ) {

    openedGifts.push(
      gift.id
    );

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

    /*
      新しい数字から順番に表示
    */

    [...history]
      .reverse()
      .forEach(
        function (number, index) {

          const numberElement =
            document.createElement("span");

          numberElement.className =
            "history-number";


          /*
            一番新しい数字だけ
            ピンク色にする
          */

          if (index === 0) {

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
   指定時間待つ
========================= */

function wait(milliseconds) {

  return new Promise(
    function (resolve) {

      setTimeout(
        resolve,
        milliseconds
      );

    }
  );

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


  /*
    STARTボタンを押した操作の中で
    音声を再生します。
  */

  playBingoSound();


  const intervalTime =
    75;

  const startTime =
    Date.now();


  /*
    音源の決定音が鳴るまで、
    数字を高速で切り替えます。
  */

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
              >= DRAW_DURATION_MS
            ) {

              clearInterval(
                timer
              );

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

  animateCurrentNumber();

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


  /*
    再生中の音声も停止
  */

  bingoAudio.pause();
  bingoAudio.currentTime = 0;


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