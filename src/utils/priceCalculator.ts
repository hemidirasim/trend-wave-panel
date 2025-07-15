

import { Service } from "@/types/api";

export const calculatePrice = (service: Service, quantity: number, serviceFee: number = 0): number => {
  console.log('🔥 calculatePrice metoduna giriş:', {
    serviceName: service.public_name,
    quantity,
    serviceFee: serviceFee,
    prices: service.prices
  });

  // Validate inputs
  if (!service || !service.prices || service.prices.length === 0) {
    console.log('❌ Xidmət və ya qiymət məlumatları mövcud deyil');
    return 0;
  }

  if (quantity <= 0) {
    console.log('❌ Miqdar sıfır və ya mənfi');
    return 0;
  }

  const priceRange = service.prices.find(
    (price) =>
      quantity >= parseInt(price.minimum) && quantity <= parseInt(price.maximum)
  );

  if (!priceRange) {
    console.log('❌ Uyğun qiymət aralığı tapılmadı', {
      quantity,
      availableRanges: service.prices.map(p => ({
        min: p.minimum,
        max: p.maximum
      }))
    });
    return 0;
  }

  const pricingPer = parseInt(priceRange.pricing_per);
  const priceForPricingPer = parseFloat(priceRange.price);
  
  // Validate parsed values
  if (isNaN(pricingPer) || pricingPer <= 0) {
    console.log('❌ Pricing per qiyməti düzgün deyil:', priceRange.pricing_per);
    return 0;
  }
  
  if (isNaN(priceForPricingPer) || priceForPricingPer < 0) {
    console.log('❌ Qiymət düzgün deyil:', priceRange.price);
    return 0;
  }

  // Calculate the cost for the requested quantity
  // priceForPricingPer is the cost for pricingPer units
  // So the cost per unit is: priceForPricingPer / pricingPer
  // And the total cost for quantity units is: (priceForPricingPer / pricingPer) * quantity
  const costPerUnit = priceForPricingPer / pricingPer;
  const totalCost = costPerUnit * quantity;
  
  // Apply service fee as fixed amount (not percentage)
  const finalPrice = totalCost + serviceFee;
  
  console.log('💰 Service price calculation:', {
    serviceName: service.public_name,
    pricingPer: pricingPer,
    priceForPricingPer: priceForPricingPer,
    costPerUnit: costPerUnit,
    quantity: quantity,
    totalCost: totalCost,
    serviceFeeUSD: serviceFee,
    finalPrice: finalPrice
  });
  
  return Math.max(0, finalPrice); // Ensure non-negative result
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  console.log('🔥 formatPrice giriş:', { input: price, numPrice, type: typeof price });
  
  // Handle invalid numbers or NaN
  if (isNaN(numPrice)) {
    console.log('🔥 formatPrice: NaN detected, returning 0');
    return '0';
  }
  
  // Handle negative numbers
  if (numPrice < 0) {
    console.log('🔥 formatPrice: Negative number, returning 0');
    return '0';
  }
  
  // If the price is exactly 0, return '0'
  if (numPrice === 0) {
    console.log('🔥 formatPrice: Price is exactly 0');
    return '0';
  }
  
  // Convert to string with appropriate precision
  let result;
  
  // If it's a very small number (less than 0.01), use more decimal places
  if (numPrice < 0.01) {
    result = numPrice.toFixed(6);
  } else if (numPrice < 1) {
    result = numPrice.toFixed(4);
  } else {
    result = numPrice.toFixed(2);
  }
  
  // Remove trailing zeros and unnecessary decimal point
  result = result.replace(/\.?0+$/, '');
  
  console.log('🔥 formatPrice: Final result:', {
    original: numPrice,
    formatted: result
  });
  
  return result;
};

