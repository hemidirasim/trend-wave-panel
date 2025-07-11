
import { Service } from "@/types/api";

export const calculatePrice = (service: Service, quantity: number, serviceFee: number = 0): number => {
  console.log('🔥 calculatePrice metoduna giriş:', {
    serviceName: service.public_name,
    quantity,
    serviceFee: serviceFee,
    prices: service.prices
  });

  const priceRange = service.prices.find(
    (price) =>
      quantity >= parseInt(price.minimum) && quantity <= parseInt(price.maximum)
  );

  if (!priceRange) {
    console.log('❌ Uyğun qiymət aralığı tapılmadı');
    return 0;
  }

  const pricePer = parseInt(priceRange.pricing_per);
  const basePrice = parseFloat(priceRange.price);
  const baseCost = (quantity / pricePer) * basePrice;
  
  const finalPrice = baseCost + serviceFee;
  
  console.log('💰 Service price calculation:', {
    serviceName: service.public_name,
    basePricePer: pricePer,
    basePrice: basePrice,
    baseCost: baseCost,
    serviceFee: serviceFee,
    priceWithFee: finalPrice,
    pricePerUnit: finalPrice / quantity
  });
  
  return finalPrice;
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (numPrice % 1 === 0) {
    return numPrice.toString();
  }
  
  return numPrice.toFixed(10).replace(/\.?0+$/, '');
};
