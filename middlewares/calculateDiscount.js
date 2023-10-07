// function calculateDiscount(product, user) {
//   if (user?.plan.planID) {
//     const discountPercentage = user.plan.planID.discount;
//     const discountedPrice =
//       product.price - (discountPercentage / 100) * product.price;

//     return discountedPrice.toFixed(2);
//   } else {
//     return product.price.toFixed(2);
//   }
// }

function calculateDiscount(product, user) {
  return product.price.toFixed(2);
}

module.exports = calculateDiscount;
