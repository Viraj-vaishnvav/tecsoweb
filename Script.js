// Sticky Navigation Menu JS Code
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");
console.log(scrollBtn);
let val;
window.onscroll = function() {
  if(document.documentElement.scrollTop > 20){
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  }else{
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }

}

// Side NavIgation Menu JS Code
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = function(){
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
  scrollBtn.style.pointerEvents = "none";
}
cancelBtn.onclick = function(){
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  scrollBtn.style.pointerEvents = "auto";
}

// Side Navigation Bar Close While We Click On Navigation Links
let navLinks = document.querySelectorAll(".menu li a");
for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click" , function() {
    navBar.classList.remove("active");
    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
  });
}

//cursor
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

// for intro motion
let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);


function update(t) {

    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.lineCap = "round";
	 ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();
    
    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// animation
const AnimateOnScroll = function ({ offset } = { offset: 10 }) {
  // Define a dobra superior, inferior e laterais da tela
  const windowTop = (offset * window.innerHeight) / 100;
  const windowBottom = window.innerHeight - windowTop;
  const windowLeft = 0;
  const windowRight = window.innerWidth;

  this.start = (element) => {
    window.requestAnimationFrame(() => {
      // Seta os atributos customizados
      element.style.animationDelay = element.dataset.animationDelay;
      element.style.animationDuration = element.dataset.animationDuration;

      // Inicia a animacao setando a classe para animar
      element.classList.add(element.dataset.animation);

      // Seta o elemento como animado
      element.dataset.animated = "true";
    });
  };

  this.inViewport = (element) => {
    // Obtem o boundingbox do elemento
    const elementRect = element.getBoundingClientRect();
    const elementTop =
      elementRect.top + parseInt(element.dataset.animationOffset) ||
      elementRect.top;
    const elementBottom =
      elementRect.bottom - parseInt(element.dataset.animationOffset) ||
      elementRect.bottom;
    const elementLeft = elementRect.left;
    const elementRight = elementRect.right;

    // Verifica se o elemento esta na tela
    return (
      elementTop <= windowBottom &&
      elementBottom >= windowTop &&
      elementLeft <= windowRight &&
      elementRight >= windowLeft
    );
  };

  // Percorre o array de elementos, verifica se o elemento está na tela e inicia animação
  this.verifyElementsInViewport = (els = elements) => {
    for (let i = 0, len = els.length; i < len; i++) {
      // Passa para o proximo laço se o elemento ja estiver animado
      if (els[i].dataset.animated) continue;

      this.inViewport(els[i]) && this.start(els[i]);
    }
  };

  // Obtem todos os elementos a serem animados
  this.getElements = () =>
    document.querySelectorAll("[data-animation]:not([data-animated])");

  // Atualiza a lista de elementos a serem animados
  this.update = () => {
    elements = this.getElements();
    elements && this.verifyElementsInViewport(elements);
  };

  // Inicia os eventos
  window.addEventListener("load", this.update, false);
  window.addEventListener(
    "scroll",
    () => this.verifyElementsInViewport(elements),
    { passive: true }
  );
  window.addEventListener(
    "resize",
    () => this.verifyElementsInViewport(elements),
    { passive: true }
  );
};

// Initialize
const options = {
  offset: 15 // percentage of the window
};

const animation = new AnimateOnScroll(options);


// Work with

(function () { // 即時実行関数（グローバル汚染対策）
  let i = 0; // for文用変数の定義
  let j = 0; // 上記内処理でfor文を使用している箇所のfor文用変数定義
  let el = {}; // 配列・変数用（巻き上げ防止の為、冒頭にて宣言）

  document.addEventListener('DOMContentLoaded', function () {
    // 各種セレクタ・値の設定 ※アニメーションの速度などはCSS側で指定
    el.bottomSlider = document.querySelectorAll('.js-bottom-slider'); // スライダーのセレクタを取得
    el.slideItemElement = '.js-slide-item'; // スライドアイテムのセレクタを指定
    el.buttonPrevElement = '.js-button-prev'; // 前へボタンのセレクタを指定
    el.buttonNextElement = '.js-button-next'; // 次へボタンのセレクタを指定
    el.slideAnimationClass = 'is-bottom-slide'; // スライドアニメーション用のclass名を指定（下にスライドさせている箇所で使用）
    el.xSetValue = 50; // x軸の基礎値を設定（x軸のスライド毎のずらし値）
    el.ySetValue = -30; // y軸の基礎値を設定（y軸のスライド毎のずらし値）
    el.unitSetValue = 'px'; // x・y軸の基礎値の単位の設定（例：px、%、vw、vhなど）
    el.arrowDisplayHideFlag = true; // 次へ・前へボタンの前と次のスライドがない場合、スライドボタンの表示・非表示をするかを指定（true：表示・非表示切り替えする、false：表示・非表示切り替えしない）

    // スライダー要素があるか判定
    if (el.bottomSlider.length && document.querySelectorAll(el.slideItemElement).length && document.querySelectorAll(el.buttonPrevElement).length && document.querySelectorAll(el.buttonNextElement).length) {
      // スライダーを初期化
      el.bottomSlideInitializationFnc(); // スライド初期化用関数の実行

      // 前へボタンのイベント処理
      for (i = 0; i < document.querySelectorAll(el.buttonPrevElement).length; ++i) {
        document.querySelectorAll(el.buttonPrevElement)[i].addEventListener('click', {
          // 引数と関数をオブジェクトにして渡す
          targetIndex: i, // 現在の該当要素が何番目かの情報を指定
          handleEvent: el.bottomSliderPrevFnc // 実行する関数を指定
        }, false);
      }

      // 次へボタンのイベント処理
      for (i = 0; i < document.querySelectorAll(el.buttonNextElement).length; ++i) {
        document.querySelectorAll(el.buttonNextElement)[i].addEventListener('click', {
          // 引数と関数をオブジェクトにして渡す
          targetIndex: i, // 現在の該当要素が何番目かの情報を指定
          handleEvent: el.bottomSliderNextFnc // 実行する関数を指定
        }, false);
      }
    } else {
      return; // 現在このreturnが存在している関数の処理を値を返しつつ止める。
    }
  }, false);

  // スライド初期化用関数
  el.bottomSlideInitializationFnc = function () {
    for (i = 0; i < el.bottomSlider.length; ++i) {
      el.initialSlideItem = el.bottomSlider[i].querySelectorAll(el.slideItemElement); // 各スライダーの初期スライド要素を取得

      el.bottomSlider[i].querySelector(el.buttonPrevElement).dataset.slideCurrent = 0; // 指定したデータ属性値を設定
      el.bottomSlider[i].querySelector(el.buttonNextElement).dataset.slideCurrent = 0; // 指定したデータ属性値を設定

      // 次へ・前へボタンの前と次のスライドがない場合、表示・非表示をするかの判定フラグが「true」か判定
      if (el.arrowDisplayHideFlag) {
        el.bottomSlider[i].querySelector(el.buttonPrevElement).style.display = 'none'; // 前へボタン非表示
      }

      // 該当要素数分処理
      for (j = 0; j < el.initialSlideItem.length; ++j) {
        // 条件を満たしているか判定
        if (j === 0) {
          el.xValue = 0; // x軸の初期位置の座標を指定
          el.yValue = 0; // y軸の初期位置の座標を指定
        } else {
          el.xValue = el.xSetValue * j; // x軸の基礎値を調整し設定
          el.yValue = el.ySetValue * j; // y軸の基礎値を調整し設定
        }

        el.zIndexValue = el.initialSlideItem.length - j; // z-index値の調整
        el.cssStyles = 'transform: translate(' + el.xValue + el.unitSetValue + ', ' + el.yValue + el.unitSetValue + ');' + ' z-index: ' + el.zIndexValue + ';'; // style値を設定
        el.initialSlideItem[j].style.cssText = el.cssStyles; // 指定要素にstyleを設定
      }
    }
  }

  // 「前へ」スライド実行用関数
  el.bottomSliderPrevFnc = function () {
    el.targetIndex = this.targetIndex; // 現在の該当要素が何番目かの情報を変数に格納
    el.slideCurrent = el.bottomSlider[el.targetIndex].querySelector(el.buttonPrevElement).dataset.slideCurrent; // 現在index番号を取得
    el.slideCurrentAfter = parseInt(el.slideCurrent, 10); // 文字列を整数に変換（小数点以下を切り捨てる）

    // 条件を満たしているか判定
    if (el.slideCurrentAfter === 0) {
      return; // 現在このreturnが存在している関数の処理を値を返しつつ止める。
    } else {
      el.bottomSlider[el.targetIndex].querySelector(el.buttonPrevElement).dataset.slideCurrent = el.slideCurrentAfter - 1; // 指定したデータ属性値を設定
      el.bottomSlider[el.targetIndex].querySelector(el.buttonNextElement).dataset.slideCurrent = el.slideCurrentAfter - 1; // 指定したデータ属性値を設定
      el.bottomSlider[el.targetIndex].querySelectorAll(el.slideItemElement)[el.slideCurrent - 1].classList.remove(el.slideAnimationClass); // 指定要素にclassを付与
    }

    el.slideItemActive = el.bottomSlider[el.targetIndex].querySelectorAll(el.slideItemElement + ':not(.' + el.slideAnimationClass + ')'); // 現在表示中のセレクタを取得

    el.bottomSlideFnc(el.slideItemActive, el.targetIndex); // スライド実行用関数の実行
  }

  // 「次へ」スライド実行用関数
  el.bottomSliderNextFnc = function () {
    el.targetIndex = this.targetIndex; // 現在の該当要素が何番目かの情報を変数に格納
    el.slideCurrent = el.bottomSlider[el.targetIndex].querySelector(el.buttonNextElement).dataset.slideCurrent; // 現在index番号を取得
    el.slideCurrentAfter = parseInt(el.slideCurrent, 10); // 文字列を整数に変換（小数点以下を切り捨てる）

    // 条件を満たしているか判定
    if (el.bottomSlider[el.targetIndex].querySelectorAll(el.slideItemElement).length === el.slideCurrentAfter + 1) {
      return; // 現在このreturnが存在している関数の処理を値を返しつつ止める。
    } else {
      el.bottomSlider[el.targetIndex].querySelector(el.buttonPrevElement).dataset.slideCurrent = el.slideCurrentAfter + 1; 
      el.bottomSlider[el.targetIndex].querySelector(el.buttonNextElement).dataset.slideCurrent = el.slideCurrentAfter + 1; 
      el.bottomSlider[el.targetIndex].querySelectorAll(el.slideItemElement)[el.slideCurrent].classList.add(el.slideAnimationClass); 
    }

    el.slideItemActive = el.bottomSlider[el.targetIndex].querySelectorAll(el.slideItemElement + ':not(.' + el.slideAnimationClass + ')'); 

    el.bottomSlideFnc(el.slideItemActive, el.targetIndex); 
  }

  el.bottomSlideFnc = function (slideItem, targetIndex) {
    
    if (el.arrowDisplayHideFlag) {
      
      if (el.bottomSlider[targetIndex].querySelectorAll(el.slideItemElement).length - slideItem.length === 0) {
        el.bottomSlider[targetIndex].querySelector(el.buttonPrevElement).style.display = 'none'; 
      } else {
        el.bottomSlider[targetIndex].querySelector(el.buttonPrevElement).style.display = 'block'; 
      }

      
      if (slideItem.length - 1 === 0) {
        el.bottomSlider[targetIndex].querySelector(el.buttonNextElement).style.display = 'none'; 
      } else {
        el.bottomSlider[targetIndex].querySelector(el.buttonNextElement).style.display = 'block'; 
      }
    }

    // 該当要素数分処理
    for (i = 0; i < slideItem.length; ++i) {
      // 条件を満たしているか判定
      if (i === 0) {
        el.xValue = 0; 
        el.yValue = 0; 
      } else {
        el.xValue = el.xSetValue * i; 
        el.yValue = el.ySetValue * i; 
      }

      el.zIndexValue = slideItem.length - i; 
      el.cssStyles = 'transform: translate(' + el.xValue + el.unitSetValue + ', ' + el.yValue + el.unitSetValue + ');' + ' z-index: ' + el.zIndexValue + ';'; // style値を設定
      slideItem[i].style.cssText = el.cssStyles; 
    }
  }
}());
// FAQ
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}


//popup
const closeBtn = document.getElementById('close');
const modalMenu = document.getElementById('modal');
const modalBtn = document.querySelector('.modal__button');
const overlay = document.getElementById('overlay');

setTimeout(() => {
  modalMenu.classList.add('show');
  overlay.style.display = 'block'; // Show overlay when modal opens
}, 8000);

closeBtn.addEventListener('click', () => {
  modalMenu.classList.remove('show');
  overlay.style.display = 'none'; // Hide overlay when modal closes
});

modalBtn.addEventListener('click', () => {
  modalMenu.classList.remove('show');
  overlay.style.display = 'none'; // Hide overlay when modal closes
});

// footer
document.addEventListener("DOMContentLoaded", function() {
  const contactDetails = {
    "India": {
      phone: "+91 90239 72356",
      email: "info@indiaexample.com"
    },
    "USA": {
      phone: "987-654-3210",
      email: "info@usaexample.com"
    },
    "Canada": {
      phone: "555-555-5555",
      email: "info@canadaexample.com"
    }
  };

  const phoneNumberElement = document.getElementById("phone-number");
  const emailElement = document.querySelector(".email");

  document.querySelectorAll(".countries button").forEach(button => {
    button.addEventListener("click", function() {
      const country = this.getAttribute("data-country");
      phoneNumberElement.textContent = contactDetails[country].phone;
      emailElement.textContent = contactDetails[country].email;
    });
  });
});

const sliderContainer = document.querySelector('.techso-slider-container');
const slider = document.querySelector('.techso-slider');
const slide = document.querySelector('.techso-slide');
const slideWidth = slide.offsetWidth;

// Calculate the number of slides needed to fill the container width
const containerWidth = sliderContainer.offsetWidth;
const slideText = "Call now: +91 90239 72356";
const numSlides = Math.ceil(containerWidth / slideWidth);

// Clone the slide and append it to the slider with a space at the end
for (let i = 0; i < numSlides; i++) {
  const slideClone = slide.cloneNode(true);
  slideClone.textContent = slideText + " ";
  slider.appendChild(slideClone);
}




var loader;

function loadNow(opacity) {
    if (opacity <= 0) {
        displayContent();
    } else {
        loader.style.opacity = opacity;
        window.setTimeout(function() {
            loadNow(opacity - 0.05);
        }, 50);
    }
}

function displayContent() {
    loader.style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function() {
    loader = document.getElementById('loader');
    loadNow(1);
});

// contact

