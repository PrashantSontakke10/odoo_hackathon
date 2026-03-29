const axios = require('axios');

exports.convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        if(fromCurrency === toCurrency) return amount;
        
        // Fetch exchange rates from external API
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const rates = response.data.rates;
        
        if(rates && rates[toCurrency]) {
            return amount * rates[toCurrency];
        }
        throw new Error(`Currency conversion from ${fromCurrency} to ${toCurrency} not supported or missing.`);
    } catch (error) {
        console.error("Currency Service Error:", error.message);
        throw error;
    }
};
