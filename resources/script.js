function sendLogRequest() {
  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      const logDetails = {
        ip: data.ip,                       
        country: data.country_name,         
        region: data.region,                
        city: data.city,                    
        isp: data.org,                      
        timezone: data.timezone,            
        latitude: data.latitude,            
        longitude: data.longitude,          
        userAgent: navigator.userAgent,     
        referer: window.location.href,         
        language: navigator.language || navigator.userLanguage,  
        deviceType: getDeviceType(),         
        os: getOS(),                         
        browser: getBrowser(),              
        screenResolution: `${window.innerWidth}x${window.innerHeight}`, 
        colorDepth: screen.colorDepth,      
        networkType: getNetworkType(),      
        localStorage: !!window.localStorage, 
        sessionStorage: !!window.sessionStorage, 
        connectionType: navigator.connection ? navigator.connection.effectiveType : "unknown",
      };

      const queryString = new URLSearchParams({
        Data: JSON.stringify(logDetails)
      }).toString();

      fetch(`https://samratsarkar.in/creativeuxworks/log2.php?${queryString}`)
        .then(response => {
          if (response.ok) {
            console.log('');
          } else {
            console.error('');
          }
        })
        .catch(error => {
          console.error('');
        });
    })
    .catch(error => {
      console.error('');
    });
}

function getDeviceType() {
  const md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile()) return 'Mobile';
  if (md.tablet()) return 'Tablet';
  return 'Desktop';
}

function getOS() {
  const platform = navigator.platform.toLowerCase();
  if (/win/.test(platform)) return 'Windows';
  if (/mac/.test(platform)) return 'MacOS';
  if (/linux/.test(platform)) return 'Linux';
  if (/android/.test(navigator.userAgent.toLowerCase())) return 'Android';
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) return 'iOS';
  return 'Unknown OS';
}

function getBrowser() {
  const userAgent = navigator.userAgent;
  if (/Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)) return 'Chrome';
  if (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)) return 'Safari';
  if (/Firefox/.test(userAgent)) return 'Firefox';
  if (/MSIE/.test(userAgent) || /Trident/.test(userAgent)) return 'Internet Explorer';
  if (/Edge/.test(userAgent)) return 'Edge';
  return 'Unknown Browser';
}

function getNetworkType() {
  if (navigator.connection) {
    return navigator.connection.effectiveType || "unknown";
  }
  return "unknown";
}

window.onload = function () {
   const loaderWrapper = document.getElementById('loader-wrapper');
   if (loaderWrapper) {
      loaderWrapper.classList.add('hidden');
   }
   const currentYearSpan = document.getElementById('current-year');
   if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
   }
   sendLogRequest();
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

      document.querySelectorAll('.price[data-price1][data-price2]').forEach(el => {
         const price1 = parseFloat(el.dataset.price1); 
         const price2 = parseFloat(el.dataset.price2); 

         const converted1 = Math.ceil(price1 * rate);
         const converted2 = Math.ceil(price2 * rate);

         el.innerHTML = `
            <div><strong>Project Based</strong> ${converted1} ${userCurrency} <span style="font-size:0.85em; opacity:0.7;">(Converted from $${price1})</span></div>
            <div><strong>Hourly Based</strong> ${converted2} ${userCurrency}/hr <span style="font-size:0.85em; opacity:0.7;">(Converted from $${price2}/hr)</span></div>
         `;
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

document.addEventListener('DOMContentLoaded', function() {
   const faqItems = document.querySelectorAll('.faq-item');
   
   faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
         faqItems.forEach(otherItem => {
            if (otherItem !== item) {
               otherItem.classList.remove('active');
            }
         });   
         item.classList.toggle('active');
      });
   });
});
