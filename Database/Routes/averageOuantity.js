// find average quantity
const AverageQuantity = (totalQuantityPurchase, totalOrders) => {
    return totalOrders > 0 ? (totalQuantityPurchase / totalOrders).toFixed(2) : 0;
};

module.exports = { AverageQuantity };