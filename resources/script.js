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
   } else {
      entry.target.classList.remove('is-visible'); 
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

const modal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close');
const serviceButtons = document.querySelectorAll('#services .cta-btn');
const orderForm = document.getElementById('orderForm');

serviceButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'block';
    const serviceName = button.closest('.service-card').querySelector('h4').textContent;
    document.getElementById('service').value = serviceName;
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value,
  };

  const queryString = new URLSearchParams({
    Data: JSON.stringify(formData)
  }).toString();

  fetch(`https://samratsarkar.in/creativeuxworks/log1.php?${queryString}`)
    .then(response => {
      if (response.ok) {
        alert("We Have Received Your Service Request. We'll Get Back To You Soon.");
        modal.style.display = 'none';
        orderForm.reset();
      } else {
        alert("Oops.. Something Went Wrong. Try Again Later.");
      }
    })
    .catch(error => {
      alert("Oops.. Something Went Wrong. Try Again Later.");
    });
});
