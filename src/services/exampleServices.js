const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");

exports.createMultipleSecurityTradingStatus = async (dataArray) => {
  try {
    // Insert multiple records into the database
    const records = await db.securityOrderBook.createMany({
      data: dataArray,
      skipDuplicates: true, // Optional: skips inserting duplicate records
    });

    return records;
  } catch (errors) {
    throw new AppError(
      errors.message || "Failed to create multiple security trading statuses."
    );
  }
};
//example data:
// [
//   {
//     id: 719,
//     Symbol: 'SBM',
//     mnName: 'Төрийн Банк ХК',
//     enName: 'State Bank ',
//     Volume: 22592,
//     Turnover: 10420733,
//     MDSubOrderBookType: 'Regular',
//     LastTradedPrice: 462,
//     PreviousClose: 463.2,
//     ClosingPrice: 0,
//     OpeningPrice: 479.9,
//     Changes: '-1.20',
//     Changep: -0.26,
//     VWAP: 461.258,
//     MDEntryTime: '2024-11-27T10:32:00.000Z',
//     trades: 48,
//     HighPrice: 470,
//     LowPrice: 460,
//     MarketSegmentID: 'I ангилал',
//     sizemd: '250',
//     MDEntryPx: 460.02,
//     sizemd2: '5551',
//     MDEntryPx2: 462
//   }
// ]
