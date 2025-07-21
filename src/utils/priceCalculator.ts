
import { Service } from "@/types/api";

export const calculatePrice = (
  service: Service, 
  quantity: number, 
  serviceFeePercentage: number = 0,
  baseFee: number = 0
): number => {
  console.log('🔥 calculatePrice metoduna giriş:', {
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
    console.log('❌ Uyğun qiymət aralığı tapılmadı', {
      quantity,
      availableRanges: service.prices.map(p => ({
        min: p.minimum,
        max: p.maximum
      }))
    });
    return 0;
  }

  // Check if this is a comment service for debugging
  const isCommentService = service.public_name.toLowerCase().includes('comment') || 
                          service.public_name.toLowerCase().includes('şərh');
  
  if (isCommentService) {
    console.log('🔍 Comment service detected:', {
      serviceName: service.public_name,
      priceRange: priceRange,
      pricingPer: priceRange.pricing_per,
      price: priceRange.price,
      rawPricingPer: priceRange.pricing_per,
      rawPrice: priceRange.price
    });
  }

  // Parse pricing_per and price - handle decimal strings properly
  const pricingPer = parseFloat(priceRange.pricing_per);
  const priceForPricingPer = parseFloat(priceRange.price);
  
  // Validate parsed values with more detailed logging
  if (isNaN(pricingPer) || pricingPer <= 0) {
    console.log('❌ Pricing per qiyməti düzgün deyil:', {
      serviceName: service.public_name,
      originalValue: priceRange.pricing_per,
      parsedValue: pricingPer,
      typeOfOriginal: typeof priceRange.pricing_per
    });
    return 0;
  }
  
  if (isNaN(priceForPricingPer) || priceForPricingPer < 0) {
    console.log('❌ Qiymət düzgün deyil:', {
      serviceName: service.public_name,
      originalValue: priceRange.price,
      parsedValue: priceForPricingPer,
      typeOfOriginal: typeof priceRange.price
    });
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
    finalPrice: finalPrice
  });
  
  return Math.max(0, finalPrice); // Ensure non-negative result
};
