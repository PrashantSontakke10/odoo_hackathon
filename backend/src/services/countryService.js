const axios = require('axios');

exports.getCountriesAndCurrencies = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
        return response.data.map(country => {
            // Extract the first available currency code from the object
            const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null;
            return {
                name: country.name.common,
                currencyCode: currencyCode
            };
        }).filter(c => c.currencyCode); // Only return valid formats
    } catch (error) {
        console.error("Country REST Service Error:", error.message);
        throw error;
    }
};
