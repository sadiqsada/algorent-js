const formatPrice = price => {
  const dollarIndex = price.indexOf('$');
  const dollarValue = price.slice(dollarIndex + 1, price.length);
  let dollarValueInt = parseInt(dollarValue);
  console.log(dollarValue);

  while (dollarValueInt < 100000) {
    dollarValueInt *= 10;
  }

  const priceString = `${dollarValueInt / 1000}`;
  return priceString;
};

export default formatPrice;
