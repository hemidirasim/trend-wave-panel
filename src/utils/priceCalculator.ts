
import { Service } from "@/types/api";
import { currencyService } from "@/services/CurrencyService";

export const calculatePrice = async (
  service: Service, 
  quantity: number, 
  serviceFeePercentage: number = 0,
  baseFee: number = 0,
  targetCurrency: 'USD' | 'AZN' = 'USD'
): Promise<number> => {
  console.log('🔥 calculatePrice metoduna giriş:', {
    serviceName: service.public_name,
    quantity,
    serviceFeePercentage,
    baseFee,
    targetCurrency,
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

  // Calculate the base cost for the requested quantity (in USD)
  const costPerUnit = priceForPricingPer / pricingPer;
  const baseCost = costPerUnit * quantity;
  
  // Apply base fee first
  const costWithBaseFee = baseCost + baseFee;
  
  // Apply service fee as percentage on top of base cost + base fee
  const feeAmount = (costWithBaseFee * serviceFeePercentage) / 100;
  const finalPriceUSD = costWithBaseFee + feeAmount;
  
  // Convert to target currency if needed
  let finalPrice = finalPriceUSD;
  if (targetCurrency === 'AZN') {
    finalPrice = await currencyService.convertCurrency(finalPriceUSD, 'USD', 'AZN');
  }
  
  console.log('💰 Service price calculation:', {
    serviceName: service.public_name,
    pricingPer: pricingPer,
    priceForPricingPer: priceForPricingPer,
    costPerUnit: costPerUnit,
    quantity: quantity,
    baseCost: baseCost,
    baseFee: baseFee,
    costWithBaseFee: costWithBaseFee,
    serviceFeePercentage: serviceFeePercentage,
    feeAmount: feeAmount,
    finalPriceUSD: finalPriceUSD,
    targetCurrency: targetCurrency,
    finalPrice: finalPrice
  });
  
  return Math.max(0, finalPrice); // Ensure non-negative result
};

// Synchronous version for backward compatibility (returns USD prices)
export const calculatePriceSync = (
  service: Service, 
  quantity: number, 
  serviceFeePercentage: number = 0,
  baseFee: number = 0
): number => {
  console.log('🔥 calculatePriceSync metoduna giriş:', {
    serviceName: service.public_name,
    quantity,
    serviceFeePercentage,
    baseFee,
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
    console.log('❌ Uyğun qiymət aralığı tapılmadı');
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

  // Calculate the base cost for the requested quantity
  const costPerUnit = priceForPricingPer / pricingPer;
  const baseCost = costPerUnit * quantity;
  
  // Apply base fee first
  const costWithBaseFee = baseCost + baseFee;
  
  // Apply service fee as percentage on top of base cost + base fee
  const feeAmount = (costWithBaseFee * serviceFeePercentage) / 100;
  const finalPrice = costWithBaseFee + feeAmount;
  
  return Math.max(0, finalPrice); // Ensure non-negative result
};
