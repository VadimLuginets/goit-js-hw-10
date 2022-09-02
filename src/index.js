import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener(
  'input',
  debounce(() => {
    fetchCountries(inputEl.value.trim())
      .then(country => {
        cleanPage();
        if (country.length > 10) {
          return Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (country.length !== 1) {
          return genCountrys(country);
        } else if (country.length === 1) {
          return genChosenCountry(country);
        }
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }, DEBOUNCE_DELAY)
);

function genCountrys(country) {
  const renderHTML = country.map(({ name, flags }) => {
    return `<li class="country-flag">
    <img src="${flags.png}" alt="flag" width=64>
    <h2 class="country-info">${name}</h2>
    </li>`;
  });
  countryListEl.insertAdjacentHTML('beforeend', renderHTML.join(''));
}

function cleanPage() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function genChosenCountry(country) {
  const renderHTML = country.map(
    ({ name, flags, capital, population, languages }) => {
      const languagesToForm = languages.flatMap(e => e.name);
      return `<img class="country-info" src="${flags.png}" alt="flag" width=64>
      <h2 class="country-info">${name}</h2>
      <p class="country-info">Capital: ${capital}</p>
      <p class="country-info">Population: ${population}</p>
      <p class="country-info">Languages: ${languagesToForm}</p>`;
    }
  );
  countryInfoEl.insertAdjacentHTML('beforeend', renderHTML);
}
