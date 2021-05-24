// UserIdx Check
async function selectUserIdx(connection, userIdx) {
  const userIdxQuery = `
    select exists(select userIdx from User where userIdx = ?) as exist;
     `;
  const [userIdxRow] = await connection.query(userIdxQuery, userIdx);
  return userIdxRow;
}


// Get Home
async function selectHomeProduct(connection, [userIdx, page, size]) {

    const homeProductQuery = `
    select p.storeIdx,
       p.productIdx,
       ThumbnailUrl,
       zFlag,
       ifnull(lp.status, 'N') as status,
       s.storeName,
       productContents,
       case
           when productSale > 0 and zSaleFlag = 'N'
               then concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
           when productSale > 0 and zSaleFlag = 'Y'
                then concat('제트할인가 ', productPrice, '\n',productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
           else
               format(productPrice, 0) end as resultPrice,
      case
          when s.deliveryPrice = 0
                then '무료배송'
            else
                    '' end as deliveryPrice
      from Product p
         left join Store s on s.storeIdx = p.storeIdx
         left join LikeProduct lp on lp.productIdx = p.productIdx
         left join User u on u.userIdx = ?
      order by rand()
      limit ` + page + `, ` + size + `;
      `;
    const [homeProductRow] = await connection.query(homeProductQuery, [userIdx, page, size]);
    
    return homeProductRow;
  }

module.exports = {
    selectHomeProduct,
    selectUserIdx
  };
  