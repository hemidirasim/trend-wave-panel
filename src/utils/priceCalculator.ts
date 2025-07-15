
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

  const pricePer = parseInt(priceRange.pricing_per);
  const basePrice = parseFloat(priceRange.price);
  
  // Validate parsed values
  if (isNaN(pricePer) || pricePer <= 0) {
    console.log('❌ Pricing per qiyməti düzgün deyil:', priceRange.pricing_per);
    return 0;
  }
  
  if (isNaN(basePrice) || basePrice < 0) {
    console.log('❌ Baza qiyməti düzgün deyil:', priceRange.price);
    return 0;
  }

  // Calculate base cost
  const baseCost = (quantity / pricePer) * basePrice;
  
  // Apply service fee as fixed amount (not percentage)
  // Service fee is in USD and should be added directly to the total cost
  const finalPrice = baseCost + serviceFee;
  
  console.log('💰 Service price calculation:', {
    serviceName: service.public_name,
    basePricePer: pricePer,
    basePrice: basePrice,
    baseCost: baseCost,
    serviceFeeUSD: serviceFee,
    finalPrice: finalPrice,
    pricePerUnit: finalPrice / quantity
  });
  
  return Math.max(0, finalPrice); // Ensure non-negative result
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Handle invalid numbers
  if (isNaN(numPrice) || numPrice < 0) {
    return '0';
  }
  
  if (numPrice % 1 === 0) {
    return numPrice.toString();
  }
  
  return numPrice.toFixed(10).replace(/\.?0+$/, '');
};
