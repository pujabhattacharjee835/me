window.onload = function () {
   const loaderWrapper = document.getElementById('loader-wrapper');
   if (loaderWrapper) {
      loaderWrapper.classList.add('hidden');
   }
   const currentYearSpan = document.getElementById('current-year');
   if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
   }
};

const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.classList.add('is-visible');
      }
   });
}, {
   threshold: 0.1
});

animatedElements.forEach(el => {
   observer.observe(el);
});

async function convertPrices() {
   try {
      const geoRes = await fetch('https://ipapi.co/json/');
      const geoData = await geoRes.json();
      const userCurrency = geoData.currency;

      if (userCurrency === "USD") return;
      const rateRes = await fetch(`https://api.frankfurter.app/latest?amount=1&from=USD&to=${userCurrency}`);
      const rateData = await rateRes.json();
      const rate = rateData.rates[userCurrency];

      document.querySelectorAll('.price[data-price]').forEach(el => {
         const usdPrice = parseFloat(el.dataset.price);
         const converted = Math.ceil(usdPrice * rate);
         el.innerHTML = `${converted} ${userCurrency} <div><span>(Converted from $${usdPrice})</span></div>`;
      });
   } catch (err) {
      console.error("Currency conversion failed:", err);
   }
}

document.addEventListener("DOMContentLoaded", convertPrices);

async function autoTranslatePage() {
   try {
      const geoRes = await fetch('https://ipapi.co/json/');
      const geoData = await geoRes.json();
      const userLang = geoData.languages.split(',')[0];

      const script = document.createElement('script');
      script.src = `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit`;
      document.head.appendChild(script);

      window.googleTranslateElementInit = function() {
         new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: userLang,
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
         }, 'google_translate_element');
      };
   } catch (err) {
      console.error("Language detection failed:", err);
   }
}

document.addEventListener("DOMContentLoaded", autoTranslatePage);
