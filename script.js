document.getElementById('loading-spinner').classList.add('hidden');
document.getElementById('error-message').classList.add('hidden');

async function searchCountry(countryName) {
    countryName = countryName.trim();

    if (!countryName) {
        showError('Please enter a country name');
        return;
    }

    try {
        showLoading(true);
        clearError();
        document.getElementById('country-info').innerHTML = '';
        document.getElementById('bordering-countries').innerHTML = '';

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error('Country not found');
        }

        const country = data[0];
        displayCountryInfo(country);

        if (country.borders && country.borders.length > 0) {
            await displayBorderingCountries(country.borders);
        }

    } catch (error) {
        showError(error.message || 'An error occurred. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayCountryInfo(country) {
    const countryInfoDiv = document.getElementById('country-info');
    
    const capital = country.capital ? country.capital[0] : 'Not available';
    const population = country.population ? country.population.toLocaleString() : 'Not available';
    const region = country.region ? country.region : 'Not available';
    const flagUrl = country.flags ? country.flags.svg : '';
    const countryName = country.name.common;

    countryInfoDiv.innerHTML = `
        <h2>${countryName}</h2>
        <img src="${flagUrl}" alt="${countryName} flag" style="width: 150px; height: auto; margin: 10px 0;">
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Region:</strong> ${region}</p>
    `;
}

async function displayBorderingCountries(borderCodes) {
    const borderingCountriesDiv = document.getElementById('bordering-countries');
    borderingCountriesDiv.innerHTML = '<h3>Bordering Countries</h3>';

    try {
        for (const code of borderCodes) {
            try {
                const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                
                if (!response.ok) {
                    continue;
                }

                const data = await response.json();
                const borderCountry = data[0];

                const countryCard = document.createElement('div');
                countryCard.className = 'border-country-card';
                countryCard.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" style="width: 100px; height: auto;">
                `;

                borderingCountriesDiv.appendChild(countryCard);
            } catch (err) {
                console.error(`Error fetching border country ${code}:`, err);
            }
        }
    } catch (error) {
        console.error('Error fetching bordering countries:', error);
    }
}

function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function clearError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
}

document.getElementById('search-btn').addEventListener('click', () => {
    const countryName = document.getElementById('country-input').value;
    searchCountry(countryName);
});

document.getElementById('country-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const countryName = document.getElementById('country-input').value;
        searchCountry(countryName);
    }
});
